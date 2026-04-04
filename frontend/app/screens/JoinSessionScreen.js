import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Button from '../components/Button';
import { joinSession } from '../services/api';
import { useSession } from '../context/SessionContext';

const JoinSessionScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setSessionCode, setParticipantName } = useSession();

  const handleJoin = async () => {
    if (!code.trim() || !name.trim()) {
      setError('Please enter both session code and your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionCode = code.toUpperCase();
      await joinSession(sessionCode, name);

      setSessionCode(sessionCode);
      setParticipantName(name);

      navigation.navigate('VotingSession', { code: sessionCode });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to join session. Check the code.';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Join Session</Text>
          <Text style={styles.subtitle}>Enter the session code shared by your friends</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Session Code</Text>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="e.g., ABC123"
              placeholderTextColor="#ccc"
              value={code}
              onChangeText={(text) => setCode(text.toUpperCase())}
              maxLength={6}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
              maxLength={50}
              editable={!loading}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Join Session"
            onPress={handleJoin}
            variant="primary"
            size="large"
            loading={loading}
            disabled={loading}
            style={{ marginTop: 20 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  codeInput: {
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
  },
});

export default JoinSessionScreen;

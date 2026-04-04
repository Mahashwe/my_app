import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Where Tonight?</Text>
          <Text style={styles.subtitle}>Stop arguing about where to eat. Vote and decide together!</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Create New Session"
            onPress={() => navigation.navigate('CreateSession')}
            variant="primary"
            size="large"
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Join Existing Session"
            onPress={() => navigation.navigate('JoinSession')}
            variant="secondary"
            size="large"
          />
        </View>

        <View style={styles.features}>
          <FeatureCard icon="🎯" title="Create" description="Start a new voting session" />
          <FeatureCard icon="👥" title="Invite" description="Share the code with friends" />
          <FeatureCard icon="✅" title="Vote" description="Vote yes or no on restaurants" />
          <FeatureCard icon="🏆" title="Decide" description="See the winning restaurant" />
        </View>
      </ScrollView>
    </View>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <View style={styles.featureCard}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

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
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    lineHeight: 26,
  },
  actions: {
    marginBottom: 50,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;

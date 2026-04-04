import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import Button from '../components/Button';
import RestaurantCard from '../components/RestaurantCard';
import { getSession, fetchRestaurants, submitVote, getResults } from '../services/api';
import { useSession } from '../context/SessionContext';

const VotingSessionScreen = ({ route, navigation }) => {
  const { code } = route.params;
  const { participantName } = useSession();
  const [session, setSession] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [votedRestaurants, setVotedRestaurants] = useState(new Set());
  const [fetchingRestaurants, setFetchingRestaurants] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    loadSession();
  }, [code]);

  const loadSession = async () => {
    try {
      const response = await getSession(code);
      setSession(response.data);
      setRestaurants(response.data.restaurants || []);
      setError('');
    } catch (err) {
      setError('Session not found');
      Alert.alert('Error', 'Failed to load session');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSession();
  };

  const handleFetchRestaurants = async () => {
    setFetchingRestaurants(true);
    setError('');

    try {
      let latitude = 37.7749;
      let longitude = -122.4194;

      // Try to get actual location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
      }

      await fetchRestaurants(code, latitude, longitude);
      await loadSession();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Unable to fetch restaurants';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setFetchingRestaurants(false);
    }
  };

  const handleVote = async (restaurantId, liked) => {
    try {
      await submitVote(code, restaurantId, liked);
      setVotedRestaurants(new Set([...votedRestaurants, restaurantId]));
    } catch (err) {
      Alert.alert('Error', 'Failed to submit vote');
    }
  };

  const handleViewResults = async () => {
    setResultsLoading(true);
    try {
      const response = await getResults(code);
      setResults(response.data);
      setShowResults(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to load results');
    } finally {
      setResultsLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sessionLabel}>Session</Text>
          <Text style={styles.sessionCode}>{code}</Text>
          <Text style={styles.participantCount}>
            {session?.participants?.length || 0} people voting
          </Text>
        </View>
        <Button
          title="Home"
          onPress={() => navigation.navigate('Home')}
          variant="secondary"
          size="small"
        />
      </View>

      {restaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No restaurants yet. Let's find some!</Text>
          <Button
            title="Find Nearby Restaurants"
            onPress={handleFetchRestaurants}
            variant="primary"
            size="large"
            loading={fetchingRestaurants}
            disabled={fetchingRestaurants}
          />
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onVote={handleVote}
              hasVoted={votedRestaurants.has(item.id)}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <Button
                title="View Results"
                onPress={handleViewResults}
                variant="primary"
                size="large"
                loading={resultsLoading}
              />
              <ParticipantsList participants={session?.participants || []} />
            </View>
          }
        />
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      )}

      <ResultsModal visible={showResults} results={results} onClose={() => setShowResults(false)} />
    </View>
  );
};

const ParticipantsList = ({ participants }) => (
  <View style={styles.participantsPanel}>
    <Text style={styles.participantsTitle}>Participants</Text>
    <View style={styles.participantsList}>
      {participants.map((p) => (
        <View key={p.id} style={styles.participantTag}>
          <Text style={styles.participantName}>{p.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

const ResultsModal = ({ visible, results, onClose }) => (
  <Modal visible={visible} animationType="slide" transparent={false}>
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Voting Results</Text>
        <Button
          title="Close"
          onPress={onClose}
          variant="secondary"
          size="small"
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.resultItem}>
            <View style={styles.resultRank}>
              <Text style={styles.resultRankText}>#{index + 1}</Text>
            </View>
            <View style={styles.resultDetails}>
              <Text style={styles.resultName}>{item.restaurant.name}</Text>
              <Text style={styles.resultAddress} numberOfLines={1}>
                {item.restaurant.address}
              </Text>
              <View style={styles.resultMeta}>
                <Text style={styles.resultRating}>⭐ {item.restaurant.rating}</Text>
              </View>
            </View>
            <View style={styles.resultVotes}>
              <Text style={styles.voteCountLike}>{item.likes}</Text>
              <Text style={styles.votesLabel}>Likes</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.resultsList}
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#667eea',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  sessionCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  participantCount: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 30,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  footerContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffcdd2',
  },
  errorMessage: {
    color: '#f44336',
    fontSize: 14,
  },
  participantsPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  participantsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 8,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  participantTag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  participantName: {
    fontSize: 13,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  modalHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  resultRank: {
    justifyContent: 'center',
    marginRight: 16,
    width: 40,
  },
  resultRankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
  },
  resultDetails: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultAddress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  resultRating: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '500',
  },
  resultVotes: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteCountLike: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  votesLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default VotingSessionScreen;

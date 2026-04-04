import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Button from './Button';

const RestaurantCard = ({ restaurant, onVote, hasVoted, onError }) => {
  const [voting, setVoting] = useState(false);

  const handleVote = async (liked) => {
    setVoting(true);
    try {
      await onVote(restaurant.id, liked);
    } catch (err) {
      if (onError) onError(err.message);
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  return (
    <View style={styles.card}>
      {restaurant.photo_url && (
        <Image source={{ uri: restaurant.photo_url }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>

        <Text style={styles.address} numberOfLines={2}>
          {restaurant.address}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
          {restaurant.price_level && (
            <Text style={styles.price}>{restaurant.price_level}</Text>
          )}
        </View>

        <View style={styles.voteButtons}>
          <Button
            title="👍 Yes"
            onPress={() => handleVote(true)}
            variant={hasVoted ? 'secondary' : 'success'}
            size="medium"
            disabled={hasVoted || voting}
            loading={voting}
            style={{ flex: 1 }}
          />
          <Button
            title="👎 No"
            onPress={() => handleVote(false)}
            variant={hasVoted ? 'secondary' : 'danger'}
            size="medium"
            disabled={hasVoted || voting}
            loading={voting}
            style={{ flex: 1 }}
          />
        </View>

        {hasVoted && (
          <Text style={styles.votedText}>✓ Your vote recorded</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  rating: {
    fontSize: 13,
    color: '#ff9500',
    fontWeight: '500',
  },
  price: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  voteButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  votedText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
});

export default RestaurantCard;

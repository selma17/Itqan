import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image } from 'react-native';
import colors from '../../styles/colors';
import useTests from './useTests';
import { TEST_CARDS } from './testCards';
import styles from './styles';

const TestCard = ({ card, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.cardTopBorder} />
    <View style={styles.iconContainer}>
      <Image
        source={card.icon}
        style={card.compactIcon ? styles.cardIconImageCompact : styles.cardIconImage}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.cardTitle}>{card.title}</Text>
    <Text style={styles.cardDescription}>{card.description}</Text>
  </TouchableOpacity>
);

const TestsScreen = ({ navigation }) => {
  const { riwayaName, openTest, backToMain } = useTests(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={backToMain}>
            <Text style={styles.backButtonText}>›</Text>
          </TouchableOpacity>

          <View style={styles.ornamentTop} />
          <Text style={styles.mainTitle}>مواضع في القرآن الكريم</Text>
          <Text style={styles.subtitle}>ب{riwayaName}</Text>
          <View style={styles.ornamentBottom} />
        </View>

        <View style={styles.cardsContainer}>
          {TEST_CARDS.map(card => (
            <TestCard key={card.route} card={card} onPress={() => openTest(card.route)} />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestsScreen;

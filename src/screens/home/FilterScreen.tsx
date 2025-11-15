import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FilterScreen = ({ navigation }: any) => {
  const [sort, setSort] = useState('Popularity');
  const [category, setCategory] = useState('Episode');
  const [region, setRegion] = useState('Japan');
  const [genre, setGenre] = useState('Action');
  const [year, setYear] = useState('2022');

  const resetFilters = () => {
    setSort('Popularity');
    setCategory('Episode');
    setRegion('Japan');
    setGenre('Action');
    setYear('2022');
  };

  const applyFilters = () => {
    navigation.navigate('SearchScreen', {
      filterData: {
        sort,
        category,
        region,
        genre,
        year,
      },
    });
  };

  const renderOptions = (options: string[], selected: string, setSelected: any) =>
    options.map((option) => (
      <TouchableOpacity
        key={option}
        style={[
          styles.option,
          selected === option && styles.optionSelected,
        ]}
        onPress={() => setSelected(option)}>
        <Text
          style={[
            styles.optionText,
            selected === option && styles.optionTextSelected,
          ]}>
          {option}
        </Text>
      </TouchableOpacity>
    ));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sort & Filter</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Sort */}
        <Text style={styles.sectionTitle}>Sort</Text>
        <View style={styles.optionContainer}>
          {renderOptions(['Popularity', 'Latest Release'], sort, setSort)}
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.optionContainer}>
          {renderOptions(['Episode', 'Movie'], category, setCategory)}
        </View>

        {/* Region */}
        <Text style={styles.sectionTitle}>Region</Text>
        <View style={styles.optionContainer}>
          {renderOptions(['All', 'Japan', 'Chinese', 'Others'], region, setRegion)}
        </View>

        {/* Genre */}
        <View style={styles.genreHeader}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionContainer}>
          {renderOptions(
            [
              'All',
              'Action',
              'Slice of Life',
              'Magic',
              'Sci-Fi',
              'Mystery',
              'Comedy',
              'Romance',
              'Drama',
            ],
            genre,
            setGenre,
          )}
        </View>

        {/* Release Year */}
        <View style={styles.genreHeader}>
          <Text style={styles.sectionTitle}>Release Year</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionContainer}>
          {renderOptions(
            ['All', '2022', '2021', '2020', '2019'],
            year,
            setYear,
          )}
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
  },
  seeAll: {
    color: '#00C853',
    fontSize: 13,
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: '#00C853',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  optionSelected: {
    backgroundColor: '#00C853',
  },
  optionText: {
    color: '#00C853',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  genreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 25,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#00C853',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  resetText: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

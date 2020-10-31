import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabOneScreen() {
  const data = [
    {
      id: 1,
      color: '#b0194b'
    },
    {
      id: 2,
      color: '#a6c5e2'
    },
    {
      id: 3,
      color: '#ebd271'
    },
    {
      id: 4,
      color: '#c21331'
    },
    {
      id: 5,
      color: '#56af21'
    },
    {
      id: 6,
      color: '#a18292'
    },
    {
      id: 7,
      color: '#588924'
    }
  ] 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {data.map(datum => {
        return (
          <View key={datum.id} style={{ width: 100, height: 100, backgroundColor: datum.color, padding: 15,}}>
          </View>
        )
      })}
      {/* <EditScreenInfo path="/screens/TabOneScreen.js" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

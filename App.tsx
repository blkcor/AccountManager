import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AddModal from './components/AddModal'
import { useRef } from 'react'
type renderType = () => JSX.Element

type refProp = {
  show: () => void
  hide: () => void
}
export default function App() {
  const addModalRef = useRef<refProp>(null)
  const renderTitle: renderType = () => (
    <View style={styles.titleLayout}>
      <Text style={styles.titleTxt}>账号管理</Text>
    </View>
  )
  return (
    <View style={styles.root}>
      {renderTitle()}
      <TouchableOpacity style={styles.addButton} activeOpacity={0.4} onPress={() => addModalRef.current?.show()}>
        <Image style={styles.addImg} source={require('./assets/add.png')} />
      </TouchableOpacity>
      <AddModal ref={addModalRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    marginTop: 35,
    backgroundColor: '#f0f0f0',
  },
  titleLayout: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    position: 'absolute',
    right: 26,
    bottom: 76,
  },
  addImg: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
})

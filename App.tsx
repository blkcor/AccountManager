import AddModal from './components/AddModal'
import { useEffect, useRef, useState } from 'react'
import { load } from './utils/storage'
import { Image, KeyboardAvoidingView, LayoutAnimation, Platform, SectionList, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native'
import { Account } from './types/Account'

type renderType = () => JSX.Element

type refProp = {
  show: (currentItem: any) => void
  hide: () => void
}

type sectionListItem = {
  type: '游戏' | '平台' | '银行卡' | '其他'
  data: Account[]
}
type sectionListDataType = sectionListItem[]

const iconMap = {
  游戏: require('./assets/game.png'),
  平台: require('./assets/platform.png'),
  银行卡: require('./assets/bank.png'),
  其他: require('./assets/other.png'),
}

export default function App() {
  const addModalRef = useRef<refProp>(null)
  const [data, setData] = useState<sectionListDataType>([])
  const [sectionState, setSectionState] = useState<{ [key: string]: boolean }>({
    游戏: false,
    平台: false,
    银行卡: false,
    其他: false,
  })

  useEffect(() => {
    //enable layout animation
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
      }
    }
  }, [])
  useEffect(() => {
    load('accountList').then((data: any) => {
      const accountList: Account[] = JSON.parse(data)

      const gameList = accountList.filter((item) => item.type === '游戏') || []
      const platformList = accountList.filter((item) => item.type === '平台') || []
      const bankList = accountList.filter((item) => item.type === '银行卡') || []
      const otherList = accountList.filter((item) => item.type === '其他') || []

      const sectionListData: sectionListDataType = [
        { type: '游戏', data: gameList },
        { type: '平台', data: platformList },
        { type: '银行卡', data: bankList },
        { type: '其他', data: otherList },
      ]

      setData(sectionListData)
    })
  }, [data])
  const renderTitle: renderType = () => (
    <View style={styles.titleLayout}>
      <Text style={styles.titleTxt}>账号管理</Text>
    </View>
  )

  const renderSectionHeader = ({ section: { data, type } }: { section: sectionListItem }) => {
    return (
      <View
        style={[
          styles.header,
          {
            borderBottomLeftRadius: data.length > 0 && sectionState[type] ? 0 : 12,
            borderBottomRightRadius: data.length > 0 && sectionState[type] ? 0 : 12,
          },
        ]}
      >
        <Image style={styles.headerIcon} source={iconMap[type]} />
        <Text style={styles.headerTxt}>{type}</Text>
        <TouchableOpacity
          style={[
            styles.arrowButton,
            {
              transform: [
                {
                  rotate: sectionState[type] ? '0deg' : '-90deg',
                },
              ],
            },
          ]}
          onPress={() => {
            setSectionState({
              ...sectionState,
              [type]: !sectionState[type],
            })
            LayoutAnimation.easeInEaseOut()
          }}
        >
          <Image style={styles.arrowIcon} source={require('./assets/arrow.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderSectionItem = ({ item }: { item: Account }) => {
    if (!sectionState[item.type]) {
      return null
    }
    return (
      <TouchableOpacity
        onPress={() => {
          addModalRef.current?.show(item)
        }}
        style={styles.itemLayout}
      >
        <Text style={styles.accountNameTxt}>{item.accountName}</Text>
        <View style={styles.accountPwd}>
          <Text style={styles.accountPwdTxt}>账号: {item.account}</Text>
          <Text style={styles.accountPwdTxt}>密码: {item.password}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.root}>
      {renderTitle()}

      <SectionList sections={data} keyExtractor={(item) => item.id} renderItem={renderSectionItem} renderSectionHeader={renderSectionHeader} contentContainerStyle={styles.listContainer} />
      <TouchableOpacity style={styles.addButton} activeOpacity={0.4} onPress={() => addModalRef.current?.show(null)}>
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
    flexDirection: 'column',
  },
  listContainer: {
    paddingHorizontal: 12,
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
  arrowButton: {
    position: 'absolute',
    right: 0,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTxt: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  header: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 12,
  },
  itemLayout: {
    width: '100%',
    paddingHorizontal: 12,
    flexDirection: 'column',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  accountNameTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  accountPwd: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountPwdTxt: {
    fontSize: 14,
    color: '#666666',
    marginRight: 10,
    flex: 1,
  },
})

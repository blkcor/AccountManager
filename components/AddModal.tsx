import React, { useImperativeHandle, forwardRef, useState } from 'react'
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { getUUID } from '../utils/UUID'
import { Account } from '../types/Account'
import { save, load, remove } from '../utils/storage'

const AddModal = forwardRef((props, ref) => {
  const typeArray = ['游戏', '平台', '银行卡', '其他']
  const [isVisible, setIsVisible] = useState(false)
  const [typeIndex, setTypeIndex] = useState(0)
  const [accountName, setAccountName] = useState<string>('')
  const [account, setAccount] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isModify, setIsModify] = useState<boolean>(false)
  const [currentItem, setCurrentItem] = useState<Account>()

  const show = (currentItem: Account) => {
    if (currentItem) {
      setIsModify(true)
      setAccountName(currentItem.accountName)
      setAccount(currentItem.account)
      setPassword(currentItem.password)
      setCurrentItem(currentItem)
    } else {
      setIsModify(false)
      setAccountName('')
      setAccount('')
      setPassword('')
    }
    setIsVisible(true)
  }

  const handleSave = () => {
    if (!accountName || !account || !password) {
      alert('请填写完整信息')
      return
    }
    const accountDetail: Account = {
      id: isModify ? currentItem?.id! : getUUID(),
      type: typeArray[typeIndex],
      accountName,
      account,
      password,
    }
    load('accountList').then((data: any) => {
      const accountList: Account[] = data ? JSON.parse(data) : []
      if (isModify) {
        const index = accountList.findIndex((item) => item.id === currentItem?.id)
        accountList.splice(index, 1, accountDetail)
      } else {
        accountList.push(accountDetail)
      }
      save('accountList', JSON.stringify(accountList)).then(() => {
        hide()
      })
    })
  }

  const hide = () => {
    setIsVisible(false)
  }

  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
    }
  })

  const renderTitle = () => {
    const styles = StyleSheet.create({
      titleLayout: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      titleTxt: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
      },
      closeButton: {
        position: 'absolute',
        right: 0,
      },
      closeImg: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
      },
    })
    return (
      <View style={styles.titleLayout}>
        <Text style={styles.titleTxt}>{isModify ? '修改账号' : '添加账号'}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={hide}>
          <Image style={styles.closeImg} source={require('../assets/close.png')} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderType = () => {
    const styles = StyleSheet.create({
      typeLayout: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      typeButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 3,
        marginTop: 8,
      },
      move1PixLeft: {
        marginLeft: -1,
      },
      leftBorderRounded: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      },
      rightBorderRounded: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      },
      typeTxt: {},
    })
    return (
      <View style={styles.typeLayout}>
        {typeArray.map((item, index) => {
          return (
            <TouchableOpacity
              style={[
                styles.typeButton,
                index !== 0 && styles.move1PixLeft,
                index === 0 && styles.leftBorderRounded,
                index === 3 && styles.rightBorderRounded,
                index === typeIndex && { backgroundColor: '#3050ff' },
              ]}
              key={item}
              activeOpacity={0.4}
              onPress={() => setTypeIndex(index)}
            >
              <Text style={[styles.typeTxt, index === typeIndex && { color: 'white' }]}>{item}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderAccountName = () => {
    const styles = StyleSheet.create({
      input: {
        height: 32,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 12,
        fontSize: 14,
      },
    })
    return <TextInput maxLength={20} value={accountName} onChangeText={(text: string) => setAccountName(text)} style={styles.input} />
  }

  const renderAccount = () => {
    const styles = StyleSheet.create({
      input: {
        height: 32,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 12,
        fontSize: 14,
      },
    })
    return <TextInput maxLength={20} value={account} onChangeText={(text: string) => setAccount(text)} style={styles.input} />
  }

  const renderPassword = () => {
    const styles = StyleSheet.create({
      input: {
        height: 32,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginTop: 8,
        paddingHorizontal: 12,
        fontSize: 14,
      },
    })
    return <TextInput maxLength={20} value={password} onChangeText={(text: string) => setPassword(text)} style={styles.input} />
  }

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={hide} animationType="fade" statusBarTranslucent={true}>
      <KeyboardAvoidingView behavior="padding" style={styles.root}>
        <View style={styles.content}>
          {renderTitle()}
          <Text style={styles.subTitleTxt}>账号类型</Text>
          {renderType()}
          <Text style={styles.subTitleTxt}>账号名称</Text>
          {renderAccountName()}
          <Text style={styles.subTitleTxt}>账号</Text>
          {renderAccount()}
          <Text style={styles.subTitleTxt}>密码</Text>
          {renderPassword()}
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.6} onPress={handleSave}>
            <Text style={styles.saveTxt}>保存</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
})

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00000060',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  subTitleTxt: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
    height: 35,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3050ff',
    borderRadius: 8,
  },
  saveTxt: {
    color: '#fff',
  },
})
export default AddModal

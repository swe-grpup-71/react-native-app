import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const index = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Link href="/home" style={{color : "blue", textDecorationLine : "underline"}}> Go to home </Link>
    </View>
  )
}

export default index
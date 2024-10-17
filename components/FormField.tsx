import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type Props = {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
} & TextInputProps;

const FormField: React.FC<Props> = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black font-medium">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-black font-psemibold text-base"
          value={value}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome6
              name={!showPassword ? "eye" : "eye-slash"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

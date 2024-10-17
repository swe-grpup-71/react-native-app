import { Text, TouchableOpacity } from "react-native";
import React from "react";

type Props = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  isLoading?: boolean;
};

const CustomButton: React.FC<Props> = ({
  title,
  handlePress,
  containerStyles,
}) => {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-xl min-h-[62px] justify-center items-center ${containerStyles}`}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Text className="text-white text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

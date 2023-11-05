import React from 'react';
import { Button, Text } from '@shoutem/ui';

interface ChipProps {
    children: string;
    icon: any;
    style: object;
    compact: boolean;
    selected: boolean;
    onPress: () => void;
}


const Chip = (props: ChipProps) => {
  return (
    <Button 
      styleName={props.selected ? "secondary" : "muted"}
      style={{
        height: 40,
        margin: 5,
        borderRadius: 20,
        // backgroundColor: props.selected ? 'red': 'green',
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}
      onPress={props.onPress}
    >
      <Text>{props.children}</Text>
    </Button>
  );
};

export default Chip;
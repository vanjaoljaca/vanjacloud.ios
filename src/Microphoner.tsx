import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { Audio } from 'expo-av';

const AudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording>();

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    recording?.stopAndUnloadAsync();
    const uri = recording?.getURI(); 
    setRecording(undefined);
    console.log('Recording stopped and stored at', uri);
  };

  return (
    <View>
      <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} />
    </View>
  );
};

export default AudioRecorder;

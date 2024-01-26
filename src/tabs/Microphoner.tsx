import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { Audio, InterruptionModeIOS } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import vanjacloud from "vanjacloud.shared.js";

import { ThoughtDB } from 'vanjacloud.shared.js/dist/src/ThoughtDB';
import SoundEffects from '../utils/SoundEffects';
import { RecordingOptionsPresets } from 'expo-av/build/Audio';
const Keys = vanjacloud.Keys;

export const thoughtDb = new ThoughtDB(Keys.notion,
  Device.isDevice ? ThoughtDB.proddbid : ThoughtDB.testdbid);

class AudioRecorder {
  private recording: Audio.Recording;

  get isRecording() {
    return !!this.recording;
  }

  constructor() {

  }

  async start() {
    try {
      await Audio.requestPermissionsAsync();

      await SoundEffects.playBoop(); // this has to be before the other stuff

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.MixWithOthers
      });

      const { recording } = await Audio.Recording.createAsync(
        RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;

      // Guarda el video en un archivo temporal dentro de la aplicación
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
      const targetDir = `${FileSystem.documentDirectory}audio/`;

      await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true })

      const tempAudioUri = `${targetDir}audio_${formattedDate}.mp3`;
      console.log('recording to', tempAudioUri)

      await FileSystem.moveAsync({
        from: recording._uri,
        to: tempAudioUri,
      });


    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  async stop() {
    this.recording?.stopAndUnloadAsync();
    const uri = this.recording?.getURI();
    this.recording = undefined;
    console.log('Recording stopped');
  };
};

export default AudioRecorder;

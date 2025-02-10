import React from "react";
import { ThemedView } from "@/components/ThemedView";
import {
  AudioModule,
  AudioQuality,
  RecordingOptions,
  RecordingPresets,
  useAudioPlayer,
  useAudioRecorder,
} from "expo-audio";
import { Alert, Button, Platform, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";

// not used atm but I want to record wav 16000 mono files
const RECORDING_OPTS: RecordingOptions = {
  extension: ".wav",
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 64000,
  android: {
    outputFormat: "3gp",
    audioEncoder: "aac",
  },
  ios: {
    audioQuality: 0,
    outputFormat: AudioQuality.MEDIUM,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

export default function RecordScreen() {
  const audioRecorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const player = useAudioPlayer(audioRecorder.uri);

  console.log({ isRecording: audioRecorder.isRecording, uri: audioRecorder.uri });

  const record = async () => {
    try {
      if (Platform.OS === "web") {
        await audioRecorder.prepareToRecordAsync(RecordingPresets.LOW_QUALITY);
      }
      audioRecorder.record();
    } catch (e) {
      console.log(e);
    }
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
  };

  const play = async () => {
    player.play();
  };

  React.useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  return (
    <ThemedView style={$container}>
      <Button
        title={audioRecorder.isRecording ? "Stop Recording" : "Start Recording"}
        onPress={audioRecorder.isRecording ? stopRecording : record}
      />

      <ThemedText>Recording at: {audioRecorder.uri}</ThemedText>

      <Button title="Play" onPress={play} />
    </ThemedView>
  );
}

const $container: ViewStyle = {
  flex: 1,
  alignContent: "center",
  justifyContent: "center",
};

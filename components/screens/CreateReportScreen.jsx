import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { getMushrooms, postReport } from "../../utils/ApiCalls";

function CreateReportScreen() {
  const [species, setSpecies] = useState([]);
  const [selected, setSelected] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    getMushrooms().then((mushrooms) => {
      setSpecies(
        mushrooms.map((mushroom) => {
          return { value: mushroom.commonName };
        })
      );
    });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  function submitReport() {
    //postReport()
    //* species, note done, username - email
    //! img_url, location
  }

  return (
    <View>
      <Text>Select a species</Text>
      <SelectList
        setSelected={(val) => setSelected(val)}
        data={species}
        save="value"
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Text>Add a description</Text>
      <TextInput
        style={styles.textInput}
        multiline={true}
        numberOfLines={4}
        onChangeText={(text) => setNote({ text })}
        value={note}
      />
      <Text>Your Location</Text>
      <Button title="Add Report" onPress={submitReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "black",
    color: "white",
  },
});

export default CreateReportScreen;

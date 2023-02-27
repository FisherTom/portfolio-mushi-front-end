import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { getReportById, getMushroomByCommonName, patchReportById, getMushrooms, deleteReportById } from "../../utils/ApiCalls";
import { SelectList } from "react-native-dropdown-select-list";
import { UserContext } from "../contexts/UserContext"



function ReportScreen({ route, navigation }) {
  const { id } = route.params;
  const { user: {displayName} } = useContext(UserContext)

  const [report, setReport] = useState(null);
  const [mushroomInfo, setMushroomInfo] = useState(null);
  const [mushrooms, setMushrooms] = useState([])
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [selected, setSelected] = useState("");

  const options = mushrooms.map(({commonName}) => {
    return { value: commonName }
    })

  useEffect(() => {
    getMushrooms().then((mushrooms) => {
      setMushrooms(mushrooms)
    })
    .then(() => {
          getReportById(id).then((report) => {
      setReport(report);
      getMushroomByCommonName(report.species.species)
        .then((mushroom) => {
          setMushroomInfo(mushroom);
        })
        .catch((error) => {
          console.log("Error while fetching mushroom info: ", error);
        });
    });
    })

  }, []);

  const voteForSpecies = (id, suggestedSpecies) => {
    patchReportById(id, suggestedSpecies).then((report) => {
      console.log("Vote cast")
      setReport(report)
    })
  }

  const deleteReport = (id) => {
    deleteReportById(id). then(() => {
      navigation.navigate("Map")
    })
  }

  const handleMoreInfo = () => {
    setIsInfoVisible(true);
  };

  const handleInfoClose = () => {
    setIsInfoVisible(false);
  };

  if (!report) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View>
        <Text>username: {report.username}</Text>
        <Text>timestamp: {report.time_stamp}</Text>
        <Text>notes: {report.notes}</Text>
        <Text>
          species: {report.species.species} votes: {report.species.votes}
        </Text>
        <Text>credibility: {report.credibility}</Text>
        <Text>alternate species:</Text>
        <FlatList
          data={report.alternate_species}
          renderItem={({ item: { species, votes } }) => (
            <View>
              <Text>
                - species: {species} votes: {votes}
              </Text>
              <Button   
                onPress={() => {() => {voteForSpecies(id, species)}}}
                title="Up vote!"/>
            </View>
          )}
        />
        <SelectList
          setSelected={(val) => setSelected(val)}
          data={options}
          save="value"
          placeholder="Suggest an alternate species..."
        />
        {report.username === displayName?         
        <Button 
          title="Delete Report"
          onPress={() => {deleteReport(id)}}/> :
          null
        }
        <Button   
          onPress={() => {voteForSpecies(id, selected)}}
          title="Submit suggestion"/>
        <Button title="More Info" onPress={handleMoreInfo} />
        {isInfoVisible && (
          <Modal animationType="slide">
            <View>
              <Text>Common Name: {mushroomInfo?.commonName}</Text>
              <Text>Latin Name: {mushroomInfo?.latinName}</Text>
              <Text>Order: {mushroomInfo?.order}</Text>
              <Text>Genus: {mushroomInfo?.genus}</Text>
              <Text>Cap: {mushroomInfo?.attributes.cap}</Text>
              <Text>Stem: {mushroomInfo?.attributes.stem}</Text>
              <Text>Gills: {mushroomInfo?.attributes.gills}</Text>
              <Text>Spores: {mushroomInfo?.attributes.spores}</Text>
              <Text>Habitat: {mushroomInfo?.habitat}</Text>
              <Text>Months: {mushroomInfo?.months.join(", ")}</Text>
              <Text>Colors: {mushroomInfo?.colors.join(", ")}</Text>
              <Text>Toxic: {mushroomInfo?.toxic ? "Yes" : "No"}</Text>
              <Text>Average Height: {mushroomInfo?.averageHeight}cm</Text>
              <Button title="Close" onPress={handleInfoClose} />
            </View>
          </Modal>
        )}
      </View>
    );
  }
}

export default ReportScreen;

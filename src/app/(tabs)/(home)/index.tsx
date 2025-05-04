import { Service } from "@/src/@types/service";
import { useServiceStore } from "@/src/store/useServiceStore";
import dayjs from "dayjs";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";

export default function DoingServicesScreen() {
  const getServicesByStatus = useServiceStore(
    (state) => state.getServicesByStatus
  );
  const loadServices = useServiceStore((state) => state.loadServices);
  const allServices = useServiceStore((state) => state.services);

  const [search, setSearch] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const getServices = useCallback(() => {
    const doingServices = getServicesByStatus("DOING");
    if (search.trim() === "") {
      setFilteredServices(doingServices);
    } else {
      const filtered = doingServices.filter((service) =>
        service.plate.toLowerCase().includes(search.trim().toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [search, getServicesByStatus]);

  useEffect(() => {
    getServices();
  }, [getServices, allServices]);

  useEffect(() => {
    loadServices();
  }, []);

  const handleAdd = () => {
    router.push("/form-service");
  };

  const handleEdit = (id: string) => {
    router.push(`/form-service?id=${id}`);
  };

  const handleFinish = (service: Service) => {
    useServiceStore
      .getState()
      .updateService({ ...service, status: "FINISHED" })
      .then(() => Alert.alert("Sucesso", "Serviço finalizado com sucesso."));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir serviço",
      "Tem certeza que deseja excluir esse serviço?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            useServiceStore
              .getState()
              .deleteService(id)
              .then(() =>
                Alert.alert("Sucesso", "Servição excluído com sucesso.")
              );
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Appbar.Header>
        <Appbar.Content title="Serviços em Andamento" />
      </Appbar.Header>

      <View style={{ padding: 16, flex: 1 }}>
        <TextInput
          label="Buscar pela placa"
          value={search}
          onChangeText={setSearch}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleAdd} style={{ marginTop: 16 }}>
          Adicionar Serviço
        </Button>

        <FlatList
          style={{ marginTop: 16 }}
          data={filteredServices}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={{ marginTop: 32, alignItems: "center" }}>
              <Text>Nenhum serviço encontrado.</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 16 }}>
              <Card.Title
                title={item.model}
                subtitle={`Placa: ${item.plate}`}
                right={() => (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="pencil"
                      size={24}
                      onPress={() => handleEdit(item.id)}
                    />
                    <IconButton
                      icon="delete"
                      size={24}
                      iconColor="red"
                      onPress={() => handleDelete(item.id)}
                    />
                  </View>
                )}
              />
              <Card.Content>
                <Text>Serviço: {item.service}</Text>
                <Text>
                  Entrega prevista:{" "}
                  {dayjs(item.deliveryDate).format("DD/MM/YYYY")}
                </Text>
                <Text>Cliente: {item.ownerName}</Text>
                <Text>Telefone: {item.ownerPhone}</Text>
                <Button
                  icon={"check"}
                  elevation={4}
                  style={{ marginTop: 16 }}
                  mode="text"
                  onPress={() => handleFinish(item)}
                >
                  Finalizar Serviço
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </View>
  );
}

import { Service } from "@/src/@types/service";
import { useServiceStore } from "@/src/store/useServiceStore";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { Appbar, Button, Card, Text, TextInput } from "react-native-paper";

export default function FinishedServicesScreen() {
  const getServicesByStatus = useServiceStore(
    (state) => state.getServicesByStatus
  );
  const allServices = useServiceStore((state) => state.services);

  const [search, setSearch] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const getServices = useCallback(() => {
    const doingServices = getServicesByStatus("FINISHED");
    if (search.trim() === "") {
      setFilteredServices(doingServices);
    } else {
      const filtered = doingServices.filter((service) =>
        service.plate.toLowerCase().includes(search.trim().toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [search, getServicesByStatus]);

  const handleDeliver = (service: Service) => {
    useServiceStore
      .getState()
      .updateService({ ...service, status: "DELIVERED" })
      .then(() => Alert.alert("Sucesso", "Serviço entregue com sucesso."));
  };

  const handleReturnToDoing = (service: Service) => {
    useServiceStore
      .getState()
      .updateService({ ...service, status: "DOING" })
      .then(() =>
        Alert.alert(
          "Sucesso",
          "Serviço retornado para a fila de execução com sucesso."
        )
      );
  };

  useEffect(() => {
    getServices();
  }, [getServices, allServices]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Appbar.Header>
        <Appbar.Content title="Serviços Finalizados" />
      </Appbar.Header>

      <View style={{ padding: 16, flex: 1 }}>
        <TextInput
          label="Buscar pela placa"
          value={search}
          onChangeText={setSearch}
          mode="outlined"
        />

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
                  contentStyle={{ justifyContent: "flex-start" }}
                  icon={"check"}
                  elevation={4}
                  style={{ marginTop: 16 }}
                  mode="text"
                  onPress={() => handleDeliver(item)}
                >
                  Entregar Serviço
                </Button>
                <Button
                  contentStyle={{ justifyContent: "flex-start" }}
                  icon={"arrow-left"}
                  mode="text"
                  onPress={() => handleReturnToDoing(item)}
                >
                  Voltar serviço para fila de execução
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </View>
  );
}

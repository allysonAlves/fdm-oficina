import useFormNavigation from "@/src/hooks/useFormNavigation";
import { useServiceStore } from "@/src/store/useServiceStore";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Appbar, Button, HelperText, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import * as yup from "yup";

// Schema de validação
const schema = yup
  .object({
    model: yup.string().required("Modelo é obrigatório"),
    plate: yup.string().required("Placa é obrigatória"),
    service: yup.string().required("Serviço é obrigatório"),
    deliveryDate: yup.string().required("Data de entrega é obrigatória"),
    ownerName: yup.string().required("Nome do cliente é obrigatório"),
    ownerPhone: yup.string().required("Telefone é obrigatório"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function AddServiceScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const addService = useServiceStore((state) => state.addService);
  const updateService = useServiceStore((state) => state.updateService);
  const getById = useServiceStore((state) => state.getById);

  const isEditForm = useMemo(() => !!id, [id]);

  const { register, toNext } = useFormNavigation<FormData>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      model: "",
      plate: "",
      service: "",
      deliveryDate: "",
      ownerName: "",
      ownerPhone: "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEditForm) {
      updateService({
        id: id!,
        ...data,
        status: "DOING",
      })
        .then(() => router.back())
        .catch(() => {
          alert("Ocorreu um erro ao adicionar o serviço");
        });
    } else {
      addService({
        ...data,
        status: "DOING",
      })
        .then(() => router.back())
        .catch((error) => {
          alert("Ocorreu um erro ao adicionar o serviço");
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (isEditForm) {
      const serviceToEdit = getById(id!);
      if (serviceToEdit) {
        reset({
          model: serviceToEdit.model,
          plate: serviceToEdit.plate,
          service: serviceToEdit.service,
          deliveryDate: serviceToEdit.deliveryDate,
          ownerName: serviceToEdit.ownerName,
          ownerPhone: serviceToEdit.ownerPhone,
        });
      }
    }
  }, [id, reset]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={isEditForm ? "Editar Serviço" : "Adicionar Serviço"}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/** Campo Modelo */}
        <Controller
          control={control}
          name="model"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Modelo do veículo"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.model}
                style={{ marginBottom: 8 }}
                ref={register("model")}
                onSubmitEditing={toNext("plate")}
                autoFocus
              />
              <HelperText type="error" visible={!!errors.model}>
                {errors.model?.message}
              </HelperText>
            </>
          )}
        />

        {/** Campo Placa */}
        <Controller
          control={control}
          name="plate"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Placa"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.plate}
                style={{ marginBottom: 8 }}
                ref={register("plate")}
                onSubmitEditing={toNext("service")}
              />
              <HelperText type="error" visible={!!errors.plate}>
                {errors.plate?.message}
              </HelperText>
            </>
          )}
        />

        {/** Campo Serviço */}
        <Controller
          control={control}
          name="service"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Serviço"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.service}
                style={{ marginBottom: 8 }}
                ref={register("service")}
              />
              <HelperText type="error" visible={!!errors.service}>
                {errors.service?.message}
              </HelperText>
            </>
          )}
        />

        {/** Campo Data de Entrega */}
        <Controller
          control={control}
          name="deliveryDate"
          render={({ field: { onChange, value } }) => (
            <>
              <DatePickerInput
                locale="pt"
                label="Data de entrega"
                mode="outlined"
                value={value ? dayjs(value).toDate() : undefined}
                onChange={(d) => onChange(d?.toISOString())}
                inputMode="start"
              />
              <HelperText type="error" visible={!!errors.deliveryDate}>
                {errors.deliveryDate?.message}
              </HelperText>
            </>
          )}
        />

        {/** Campo Nome do Cliente */}
        <Controller
          control={control}
          name="ownerName"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Nome do cliente"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.ownerName}
                style={{ marginBottom: 8 }}
                ref={register("ownerName")}
                onSubmitEditing={toNext("ownerPhone")}
              />
              <HelperText type="error" visible={!!errors.ownerName}>
                {errors.ownerName?.message}
              </HelperText>
            </>
          )}
        />

        {/** Campo Telefone */}
        <Controller
          control={control}
          name="ownerPhone"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label="Telefone do cliente"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="phone-pad"
                error={!!errors.ownerPhone}
                style={{ marginBottom: 16 }}
                ref={register("ownerPhone")}
                onSubmitEditing={handleSubmit(onSubmit)}
              />
              <HelperText type="error" visible={!!errors.ownerPhone}>
                {errors.ownerPhone?.message}
              </HelperText>
            </>
          )}
        />

        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Salvar Serviço
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

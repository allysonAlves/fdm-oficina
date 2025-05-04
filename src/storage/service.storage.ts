import { Service } from '@/src/@types/service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'services'

export const serviceStorage = {
    insert: async (service: Service) => {
        const current = await serviceStorage.getAll()
        const updated = [...current, service]
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    },

    update: async (service: Service) => {
        const current = await serviceStorage.getAll()
        const updated = current.map((item) => item.id === service.id ? service : item)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    },

    delete: async (serviceId: string) => {
        const current = await serviceStorage.getAll()
        const updated = current.filter((item) => item.id !== serviceId)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    },

    getAll: async (): Promise<Service[]> => {
        const data = await AsyncStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    },
}

import { create } from 'zustand'
import { Service, ServiceStatus } from '../@types/service'
import { serviceStorage } from '../storage/service.storage'

type ServiceState = {
    services: Service[]
    loadServices: () => Promise<void>
    addService: (service: Omit<Service, 'id'>) => Promise<void>
    updateService: (service: Service) => Promise<void>
    deleteService: (id: string) => Promise<void>
    getServicesByStatus: (status: ServiceStatus) => Service[]
    getById: (id: string) => Service | undefined
}

export const useServiceStore = create<ServiceState>((set, get) => ({
    services: [],

    loadServices: async () => {
        const services = await serviceStorage.getAll()
        set({ services })
    },
    addService: async (service) => {
        await serviceStorage.insert({ ...service, id: get().services.length.toString() })
        const services = await serviceStorage.getAll()
        set({ services })
    },
    updateService: async (service) => {
        await serviceStorage.update(service)
        const services = await serviceStorage.getAll()
        set({ services })
    },
    deleteService: async (id) => {
        await serviceStorage.delete(id)
        const services = await serviceStorage.getAll()
        set({ services })
    },
    getServicesByStatus: (status) => {
        return get().services.filter((service) => service.status === status)
    },
    getById: (id: string) => get().services.find((service) => service.id === id),
}))

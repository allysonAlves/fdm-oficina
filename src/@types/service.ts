export type ServiceStatus = 'DOING' | 'FINISHED' | 'DELIVERED'

export type Service = {
    id: string
    plate: string
    model: string
    service: string
    deliveryDate: string
    ownerName: string
    ownerPhone: string
    status: ServiceStatus
}

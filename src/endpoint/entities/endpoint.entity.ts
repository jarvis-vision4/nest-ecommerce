import { Permission } from "src/permissions/entities/permission.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export type HttpEndpoint ='GET' | 'POST' | 'PUT' | 'DELETE';
@Entity()
export class Endpoint {
    @PrimaryGeneratedColumn()
    id!:number;
    @Column()
    url!:string;
    @Column()
    method!:HttpEndpoint;
    @OneToMany(()=>Permission,(permission)=>permission.endpoint)
    permissions!:Permission[]
}

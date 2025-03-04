import React from 'react';
import Users from "./Users";
import axios from "axios";
import {axiosInstance} from "../pages/fun";

export interface User {
    id?: string;
    username: string;
    password: string;
    role: string;
}

export interface UsersContainerState {
    users: User[];
    loading: boolean;
    error: string | null;
    visible?: boolean;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    fetchUsers: (page: number, pageSize: number) => void;
    updateUserAndFetchUsers: (user: User, page: number, pageSize: number) => void;
    deleteUserAndFetchUsers: (user: User, page: number, pageSize: number) => void;
    addUserAndFetchUsers: (user: User, page: number, pageSize: number) => void;
    errorUsermessage: string;
}

interface UsersContainerProps {
    visible?: boolean;
}

export class UsersContainer extends React.Component<UsersContainerProps, UsersContainerState> {
    constructor(props: UsersContainerProps) {
        super(props);
        this.state = {
            users: [],
            loading: false,
            error: null,
            visible: props.visible,
            pageNumber: 0,
            pageSize: 5,
            totalCount: 0,
            totalPages: 0,
            fetchUsers: this.fetchUsers,
            updateUserAndFetchUsers: this.updateUserAndFetchUsers,
            deleteUserAndFetchUsers: this.deleteUserAndFetchUsers,
            addUserAndFetchUsers: this.addUserAndFetchUsers,
            errorUsermessage: '',
        }
    }

    componentDidMount() {
        this.fetchUsers();  //initial fetch
    }

    private fetchUsers = (page: number = 0, pageSize: number = this.state.pageSize) => {
        this.setState({loading: true});
        axiosInstance.get('/mono/api/users', {params: {page, size: pageSize}})
            .then((response) => {
                let result = response.data;
                for (let i = 0; i < result.content.length; i++) {
                    result.content[i].password = '';
                    result.content[i].key = result.content[i].id;
                }
                this.setState({
                    users: result.content,
                    visible: true,
                    pageNumber: page + 1,
                    pageSize: pageSize,
                    totalPages: result.totalPages,
                    totalCount: result.totalElements,
                    loading: false,
                });
            }).catch(error => {
            this.setState({loading: false})
            // setOutputResult('<ERROR>' + error.message + '</ERROR>');
        }).finally(() => {

        });
    }

    private updateUserAndFetchUsers = (user: User, page: number, size: number) => {
        this.setState({loading: true, errorUsermessage: ''});
        axiosInstance.put(`/mono/api/users/${user.id}`, user)
            .then((response) => {
                this.fetchUsers(page, size)
                this.setState({loading: false});
            }).catch(error => {
            console.error("Error updating or fetching users:", error);
            this.setState({
                loading: false,
                errorUsermessage: `Error al actualizar ${user.username} o obtener la lista de usuarios `
            })
        }).finally(() => {
            // this.setState({loading: false}); // Stop loading
        });
    };

    private deleteUserAndFetchUsers = (user: User) => {
        const {pageNumber, pageSize, totalCount} = this.state; // Get current pagination data

        this.setState({loading: true, errorUsermessage: ''});

        axiosInstance.delete(`/mono/api/users/${user.id}`)
            .then(() => {
                const newTotalCount = totalCount - 1;  // Total users after deletion
                const newTotalPages = Math.ceil(newTotalCount / pageSize);  // Recalculate pages
                let newPageNumber = pageNumber;

                // If the current page becomes empty and isn't the first, go to the previous page
                if (newPageNumber > newTotalPages) {
                    newPageNumber = newTotalPages; // Move to the last valid page
                }

                this.fetchUsers(newPageNumber - 1, pageSize); // Convert to zero-based index
                this.setState({loading: false})
            }).catch((error) => {
            this.setState({loading: false, errorUsermessage: `No se pudo eliminar al usuario ${user.username}`})
            console.error("Error deleting or fetching users:", error);
            console.error("Delete operation failed for user ID:", user.id);
        }).finally(() => {
            // this.setState({ loading: false });
        });
    };
    private addUserAndFetchUsers = (user: User, page: number, size: number) => {
        const newUser = {username: user.username, password: user.password, role: user.role};
        this.setState({loading: true, errorUsermessage: ''});
        axiosInstance.post(`/mono/api/users`, newUser)
            .then(response => {
                    this.fetchUsers(page, size);
                    this.setState({loading: false})
                }
            ).catch(error => {
            this.setState({
                loading: false,
                errorUsermessage: `Error al añadir un nuevo usuario (ya existe?) ${user.username}`
            });
            console.error("Error al añadir un nuevo usuario", error);
        }).finally(() => {
            // this.setState({ loading: false });
        });
    };

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'white'}}>
                <h1>Lista de usuarios</h1>
                <div style={{display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
                    <Users
                        users={this.state.users}
                        loading={this.state.loading}
                        error={this.state.error}
                        totalCount={this.state.totalCount}
                        pageSize={this.state.pageSize}
                        pageNumber={this.state.pageNumber}
                        totalPages={this.state.totalPages}
                        fetchUsers={this.fetchUsers}
                        updateUserAndFetchUsers={this.updateUserAndFetchUsers}
                        deleteUserAndFetchUsers={this.deleteUserAndFetchUsers}
                        addUserAndFetchUsers={this.addUserAndFetchUsers}
                        errorUsermessage={this.state.errorUsermessage}
                    />
                </div>
            </div>
        );
    }
}
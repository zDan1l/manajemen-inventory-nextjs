import React from "react";
import Navbar from "../component/navbar";

const UserPage = () => {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto">
                <div className="card bg-base-100 shadow-xl mx-10 my-10">
                    <div className="card-body">
                        <div className="flex flex-row mb-2">
                            <div>
                                <h2 className="card-title">Data User</h2>
                            </div>
                            <div className="ml-auto">
                                <button className="btn btn-primary btn-sm text-white">
                                    Tambah Data
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>John Doe</td>
                                        <td>john@example.com</td>
                                        <td>Admin</td>
                                        <td>Aksi
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage;
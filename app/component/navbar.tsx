import React from "react";
import Link from 'next/link';

const Navbar = () => {
    return (
        <>
        <div className="navbar bg-base-100 shadow-sm">
            <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
            <li><a>Link</a></li>
            <li>
                <details>
                <summary>Parent</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                    <li>
                        <Link href="/home">Home</Link>
                    </li>
                    <li>
                        <Link href="/user">Data User</Link>
                    </li>
                    <li>
                        <Link href="/barang">Data Barang</Link>
                    </li>
                    <li>
                        <Link href="/penjualan">Data Penjualan</Link>
                    </li>
                </ul>
                </details>
            </li>
            </ul>
        </div>
        <div className="navbar-end">
            <b>Name Login</b>
        </div>
        </>
    )
}

export default Navbar;
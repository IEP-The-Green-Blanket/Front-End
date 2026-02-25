"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/AuthContext';
import UpdateUserForm from '@components/users/UpdateUserForm';
import TicketList from '@components/tickets/TicketList';

const AccountPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="font-bold uppercase animate-pulse">loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section>
                    <UpdateUserForm />
                </section>

                <section className="border-2 border-gray-300 bg-white min-h-[600px] flex flex-col shadow-sm">
                    <div className="border-b-2 border-gray-300 p-4 bg-gray-50">
                        <h3 className="text-center font-bold uppercase">Ticket Geschiedenis</h3>
                    </div>
                    <div className="p-6 flex-grow overflow-y-auto">
                        <TicketList active={undefined} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AccountPage;
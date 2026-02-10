import React, { useState } from 'react'
import { createContext } from 'react'

export const MainContextData = createContext();

const MainContext = ({children}) => {
    // For Customer 
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [reloadCustomerTrigger, setReloadCustomerTrigger] = useState(false);
        // For Employer
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingEmployer, setEditingEmployer] = useState(null);
    const [reloadEmployerTrigger, setReloadEmployerTrigger] = useState(false);
    
    
    const handleAddNew = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };
    
    const handleAddNewEmployee = () => {
        setEditingEmployer(null);
        setShowAddForm(true);
    };
    const handleFormClose = () => {
        setShowForm(false);
        setEditingCustomer(null);
    };
     const handleSuccess = () => {
        setReloadCustomerTrigger((prev) => !prev);
        handleFormClose();
    };

    const context = {showForm ,setShowForm,editingCustomer , setEditingCustomer, reloadCustomerTrigger , setReloadCustomerTrigger , handleFormClose,handleSuccess, showAddForm , setShowAddForm, editingEmployer , setEditingEmployer , reloadEmployerTrigger , setReloadEmployerTrigger , handleAddNew ,handleAddNewEmployee}
    console.log('MainContext Rendered');
    
  return (
    <MainContextData.Provider value={context}>
      {children}
    </MainContextData.Provider>
  )
}

export default MainContext

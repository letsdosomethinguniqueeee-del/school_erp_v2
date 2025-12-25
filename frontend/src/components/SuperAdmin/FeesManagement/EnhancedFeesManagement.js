import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from '@chakra-ui/react'
import { 
    ArrowBackIcon, 
    SettingsIcon, 
    ViewIcon, 
    AddIcon, 
    DownloadIcon,
    SearchIcon,
    EditIcon,
    InfoIcon
} from '@chakra-ui/icons';
import './EnhancedFeesManagement.css';

const EnhancedFeesManagement = () => {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/super-admin');
    };

    return (
        <>
            <div className="enhanced-fees-header">
                <div className="header-left">
                    <Button leftIcon={<ArrowBackIcon />} onClick={handleBackToDashboard} colorScheme='gray'>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
            <Tabs 
                variant='soft-rounded' 
                sx={{
                    '& .chakra-tabs__tablist': {
                        display: 'flex !important',
                        background: '#f8f9fa !important',
                        borderRadius: '8px !important',
                        padding: '6px !important',
                        border: '1px solid #e9ecef !important',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1) !important',
                        marginTop: '12px',
                        flexWrap: 'wrap',
                        gap: '8px',
                        margin: '10px 20px'
                    },
                    '& .chakra-tabs__tab': {
                        color: 'var(--tab-text-default)',
                        borderColor: 'var(--tab-blue)',
                        borderRadius: '6px',
                        transition: 'all 0.02s ease',
                        flex: '1 1 auto',
                        minWidth: '250px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        border: '1px solid #e9ecef'
                    },
                    '& .chakra-tabs__tab:hover': {
                        color: 'var(--tab-text-hover)',
                        backgroundColor: 'var(--tab-bg-hover)'
                    },
                    '& .chakra-tabs__tab[aria-selected="true"]': {
                        backgroundColor: 'var(--tab-blue)',
                        color: 'var(--tab-text-selected)',
                        borderRadius: '6px'
                    },
                    // Responsive behavior for smaller screens
                    '@media (max-width: 768px)': {
                        '& .chakra-tabs__tablist': {
                            flexDirection: 'column',
                            gap: '8px',
                            background: 'white',
                            borderRadius: '8px',
                            padding: '12px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e9ecef'
                        },
                        '& .chakra-tabs__tab': {
                            width: '100%',
                            minWidth: 'unset',
                            marginBottom: '0px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            '&:hover': {
                                backgroundColor: '#f8f9fa'
                            }
                        },
                        '& .chakra-tabs__tab[aria-selected="true"]': {
                            backgroundColor: 'var(--tab-blue)',
                            color: 'white',
                            borderRadius: '6px'
                        }
                    }
                }}
            >
                <TabList mb='1em'>
                    <Tab>
                        <span>Fee Structure</span>
                        <SettingsIcon />
                    </Tab>
                    <Tab>
                        <span>Student Fees</span>
                        <ViewIcon />
                    </Tab>
                    <Tab>
                        <span>Record Payment</span>
                        <AddIcon />
                    </Tab>
                    <Tab>
                        <span>Outstanding Fees</span>
                        <SearchIcon />
                    </Tab>
                    <Tab>
                        <span>Reports</span>
                        <DownloadIcon />
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <h3>Fee Structure Management</h3>
                        <p>Create and manage fee structures for different classes and academic years.</p>
                    </TabPanel>
                    <TabPanel>
                        <h3>Student Fees Overview</h3>
                        <p>View and manage individual student fee records and payment history.</p>
                    </TabPanel>
                    <TabPanel>
                        <h3>Record Payment</h3>
                        <p>Record new payments, generate receipts, and update payment status.</p>
                    </TabPanel>
                    <TabPanel>
                        <h3>Outstanding Fees</h3>
                        <p>Track students with pending fees and send payment reminders.</p>
                    </TabPanel>
                    <TabPanel>
                        <h3>Reports & Analytics</h3>
                        <p>Generate fee collection reports, payment trends, and financial summaries.</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
};

export default EnhancedFeesManagement;

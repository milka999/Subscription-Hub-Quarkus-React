import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  useTheme,
  HelperText,
  Card,
  Title,
  SegmentedButtons,
  Menu,
  Divider,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import moment from 'moment';

import { subscriptionService, providerService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AddSubscriptionScreen = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerPlans, setProviderPlans] = useState([]);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'MONTHLY',
    status: 'ACTIVE',
    providerId: null,
    startedAt: new Date(),
    dueDate: new Date(),
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  // Dropdown states
  const [providerOpen, setProviderOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await providerService.getServiceProviders('', 0, 100);
      const providerItems = (data.content || []).map(p => ({
        label: p.name,
        value: p.id,
      }));
      setProviders(providerItems);
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const loadProviderPlans = async (providerId) => {
    try {
      const plans = await providerService.getProviderSubscriptions(providerId);
      const planItems = plans.map(p => ({
        label: `${p.serviceName} - $${p.serviceCost}`,
        value: p.id,
        data: p,
      }));
      setProviderPlans(planItems);
    } catch (error) {
      console.error('Failed to load provider plans:', error);
    }
  };

  const handleProviderChange = async (providerId) => {
    setSelectedProvider(providerId);
    if (providerId) {
      await loadProviderPlans(providerId);
    } else {
      setProviderPlans([]);
      setSelectedPlan(null);
    }
  };

  const handlePlanChange = (planId) => {
    const plan = providerPlans.find(p => p.value === planId);
    if (plan && plan.data) {
      setFormData({
        ...formData,
        providerId: plan.value,
        name: plan.data.serviceName,
        description: plan.data.serviceDescription,
        price: plan.data.serviceCost.toString(),
      });
    }
    setSelectedPlan(planId);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        startedAt: moment(formData.startedAt).format('YYYY-MM-DD'),
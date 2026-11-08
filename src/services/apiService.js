import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchPrograms = async () => {
  const response = await axios.get(`${API_BASE_URL}/programs`);
  return response.data;
};

// Events API
export const fetchEvents = async () => {
  const response = await axios.get(`${API_BASE_URL}/events`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_BASE_URL}/events`, eventData);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_BASE_URL}/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/events/${id}`);
  return response.data;
};

// Inquiries API
export const sendInquiry = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/inquiry`, formData);
  return response.data;
};

export const fetchInquiries = async () => {
  const response = await axios.get(`${API_BASE_URL}/inquiries`);
  return response.data;
};

export const deleteInquiry = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/inquiries/${id}`);
  return response.data;
};

// Authentication & Membership API
export const registerMember = async (memberData) => {
  const response = await axios.post(`${API_BASE_URL}/members/signup`, memberData);
  return response.data;
};

export const verifyEmailToken = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/members/verify?token=${token}`);
  return response.data;
};

export const loginMember = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/members/login`, credentials);
  return response.data;
};

export const requestForgotPassword = async (email) => {
  const response = await axios.post(`${API_BASE_URL}/members/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_BASE_URL}/members/reset-password`, { token, newPassword });
  return response.data;
};

export const fetchMembers = async () => {
  const response = await axios.get(`${API_BASE_URL}/members`);
  return response.data;
};

export const toggleUserActive = async (id, is_active) => {
  const response = await axios.put(`${API_BASE_URL}/members/${id}/toggle-active`, { is_active });
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await axios.put(`${API_BASE_URL}/members/${id}/role`, { role });
  return response.data;
};

export const fetchLoginLogs = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/login-logs`);
  return response.data;
};

export const updateMemberStatus = async (id, status, rejection_reason) => {
  const response = await axios.put(`${API_BASE_URL}/members/${id}/status`, { status, rejection_reason });
  return response.data;
};

export const updateMemberProfile = async (id, profileData) => {
  const response = await axios.put(`${API_BASE_URL}/members/${id}`, profileData);
  return response.data;
};

export const deleteMember = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/members/${id}`);
  return response.data;
};
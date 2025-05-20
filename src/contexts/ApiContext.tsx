
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  category: string;
}

export interface TestCase {
  id: string;
  name: string;
  endpointId: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body: string;
  queryParams: Record<string, string>;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  responseTime: number;
  body: any;
  headers: Record<string, string>;
}

interface ApiContextType {
  endpoints: ApiEndpoint[];
  testCases: TestCase[];
  selectedEndpoint: ApiEndpoint | null;
  selectedTestCase: TestCase | null;
  currentMethod: HttpMethod;
  currentHeaders: Record<string, string>;
  currentBody: string;
  currentQueryParams: Record<string, string>;
  apiResponse: ApiResponse | null;
  loading: boolean;
  setSelectedEndpoint: (endpoint: ApiEndpoint | null) => void;
  setSelectedTestCase: (testCase: TestCase | null) => void;
  setCurrentMethod: (method: HttpMethod) => void;
  setCurrentHeaders: (headers: Record<string, string>) => void;
  setCurrentBody: (body: string) => void;
  setCurrentQueryParams: (queryParams: Record<string, string>) => void;
  sendRequest: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock data
  const [endpoints] = useState<ApiEndpoint[]>([
    { id: '1', name: 'Get Users', path: '/users', category: 'Users' },
    { id: '2', name: 'Get User by ID', path: '/users/{id}', category: 'Users' },
    { id: '3', name: 'Create User', path: '/users', category: 'Users' },
    { id: '4', name: 'Update User', path: '/users/{id}', category: 'Users' },
    { id: '5', name: 'Delete User', path: '/users/{id}', category: 'Users' },
    { id: '6', name: 'Get Products', path: '/products', category: 'Products' },
    { id: '7', name: 'Get Product by ID', path: '/products/{id}', category: 'Products' },
    { id: '8', name: 'Create Product', path: '/products', category: 'Products' },
    { id: '9', name: 'Orders List', path: '/orders', category: 'Orders' },
    { id: '10', name: 'Order Details', path: '/orders/{id}', category: 'Orders' },
  ]);

  const [testCases] = useState<TestCase[]>([
    {
      id: '1',
      name: 'Get All Users',
      endpointId: '1',
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      body: '',
      queryParams: {}
    },
    {
      id: '2',
      name: 'Get User 123',
      endpointId: '2',
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      body: '',
      queryParams: { 'id': '123' }
    },
    {
      id: '3',
      name: 'Create New User',
      endpointId: '3',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' }, null, 2),
      queryParams: {}
    },
    {
      id: '4',
      name: 'Get All Products',
      endpointId: '6',
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      body: '',
      queryParams: {}
    },
    {
      id: '5',
      name: 'Get Orders with Pagination',
      endpointId: '9',
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      body: '',
      queryParams: { 'page': '1', 'limit': '10' }
    }
  ]);

  // State
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [currentMethod, setCurrentMethod] = useState<HttpMethod>('GET');
  const [currentHeaders, setCurrentHeaders] = useState<Record<string, string>>({});
  const [currentBody, setCurrentBody] = useState<string>('');
  const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, string>>({});
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle test case selection
  const handleSelectTestCase = (testCase: TestCase | null) => {
    setSelectedTestCase(testCase);
    if (testCase) {
      const endpoint = endpoints.find(e => e.id === testCase.endpointId) || null;
      setSelectedEndpoint(endpoint);
      setCurrentMethod(testCase.method);
      setCurrentHeaders(testCase.headers);
      setCurrentBody(testCase.body);
      setCurrentQueryParams(testCase.queryParams);
    }
  };

  // Send API request
  const sendRequest = async () => {
    if (!selectedEndpoint) return;
    
    setLoading(true);
    const startTime = new Date().getTime();
    
    try {
      // For demo purposes, we'll simulate an API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock response based on the request
      let mockResponse;
      
      if (selectedEndpoint.path.includes('/users')) {
        if (currentMethod === 'GET') {
          mockResponse = {
            status: 200,
            statusText: 'OK',
            body: [
              { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
              { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
              { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
            ],
            headers: {
              'content-type': 'application/json',
              'cache-control': 'max-age=3600'
            }
          };
        } else if (currentMethod === 'POST') {
          mockResponse = {
            status: 201,
            statusText: 'Created',
            body: {
              id: 4,
              ...JSON.parse(currentBody || '{}')
            },
            headers: {
              'content-type': 'application/json',
              'location': '/users/4'
            }
          };
        } else {
          mockResponse = {
            status: 204,
            statusText: 'No Content',
            body: null,
            headers: {}
          };
        }
      } else if (selectedEndpoint.path.includes('/products')) {
        mockResponse = {
          status: 200,
          statusText: 'OK',
          body: [
            { id: 101, name: 'Laptop', price: 1299.99 },
            { id: 102, name: 'Smartphone', price: 899.99 },
            { id: 103, name: 'Headphones', price: 199.99 }
          ],
          headers: {
            'content-type': 'application/json',
            'cache-control': 'max-age=3600'
          }
        };
      } else if (selectedEndpoint.path.includes('/orders')) {
        mockResponse = {
          status: 200,
          statusText: 'OK',
          body: [
            { id: 1001, user_id: 2, total: 1299.99, status: 'shipped' },
            { id: 1002, user_id: 1, total: 899.99, status: 'processing' },
            { id: 1003, user_id: 3, total: 199.99, status: 'delivered' }
          ],
          headers: {
            'content-type': 'application/json',
            'pagination-count': '3',
            'pagination-page': currentQueryParams.page || '1',
            'pagination-limit': currentQueryParams.limit || '10'
          }
        };
      } else {
        mockResponse = {
          status: 404,
          statusText: 'Not Found',
          body: { error: 'Endpoint not found' },
          headers: {
            'content-type': 'application/json'
          }
        };
      }
      
      const endTime = new Date().getTime();
      
      setApiResponse({
        ...mockResponse,
        responseTime: endTime - startTime
      });
    } catch (error) {
      console.error('Request failed:', error);
      setApiResponse({
        status: 500,
        statusText: 'Error',
        responseTime: new Date().getTime() - startTime,
        body: { error: 'An error occurred while making the request' },
        headers: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const value: ApiContextType = {
    endpoints,
    testCases,
    selectedEndpoint,
    selectedTestCase,
    currentMethod,
    currentHeaders,
    currentBody,
    currentQueryParams,
    apiResponse,
    loading,
    setSelectedEndpoint,
    setSelectedTestCase: handleSelectTestCase,
    setCurrentMethod,
    setCurrentHeaders,
    setCurrentBody,
    setCurrentQueryParams,
    sendRequest
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

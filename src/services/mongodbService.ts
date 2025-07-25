import { supabase } from '@/integrations/supabase/client';

export class MongoDBService {
  private static async callFunction(functionName: string, payload: any) {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });

    if (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Operation failed');
    }

    return data.data;
  }

  // Generic CRUD operations
  static async find(collection: string, filter: any = {}) {
    return this.callFunction('mongodb-bridge', {
      operation: 'find',
      collection,
      filter
    });
  }

  static async findOne(collection: string, filter: any = {}) {
    return this.callFunction('mongodb-bridge', {
      operation: 'findOne',
      collection,
      filter
    });
  }

  static async insertOne(collection: string, data: any) {
    return this.callFunction('mongodb-bridge', {
      operation: 'insertOne',
      collection,
      data
    });
  }

  static async insertMany(collection: string, data: any[]) {
    return this.callFunction('mongodb-bridge', {
      operation: 'insertMany',
      collection,
      data
    });
  }

  static async updateOne(collection: string, filter: any, update: any) {
    return this.callFunction('mongodb-bridge', {
      operation: 'updateOne',
      collection,
      filter,
      update
    });
  }

  static async updateMany(collection: string, filter: any, update: any) {
    return this.callFunction('mongodb-bridge', {
      operation: 'updateMany',
      collection,
      filter,
      update
    });
  }

  static async deleteOne(collection: string, filter: any) {
    return this.callFunction('mongodb-bridge', {
      operation: 'deleteOne',
      collection,
      filter
    });
  }

  static async deleteMany(collection: string, filter: any) {
    return this.callFunction('mongodb-bridge', {
      operation: 'deleteMany',
      collection,
      filter
    });
  }

  // Authentication methods
  static async register(email: string, password: string, fullName: string) {
    return this.callFunction('mongodb-auth', {
      action: 'register',
      email,
      password,
      fullName
    });
  }

  static async login(email: string, password: string) {
    return this.callFunction('mongodb-auth', {
      action: 'login',
      email,
      password
    });
  }

  static async verifyToken(token: string) {
    return this.callFunction('mongodb-auth', {
      action: 'verify',
      token
    });
  }
}

// Specific service methods for your application
export class TicketsService {
  static async getAllTickets() {
    return MongoDBService.find('tickets');
  }

  static async getTicketById(id: string) {
    return MongoDBService.findOne('tickets', { _id: id });
  }

  static async createTicket(ticket: any) {
    return MongoDBService.insertOne('tickets', {
      ...ticket,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static async updateTicket(id: string, updates: any) {
    return MongoDBService.updateOne('tickets', { _id: id }, {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async deleteTicket(id: string) {
    return MongoDBService.deleteOne('tickets', { _id: id });
  }
}

export class UsersService {
  static async getAllUsers() {
    return MongoDBService.find('users');
  }

  static async getUserById(id: string) {
    return MongoDBService.findOne('users', { _id: id });
  }

  static async getUserByEmail(email: string) {
    return MongoDBService.findOne('users', { email });
  }

  static async createUser(user: any) {
    return MongoDBService.insertOne('users', {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static async updateUser(id: string, updates: any) {
    return MongoDBService.updateOne('users', { _id: id }, {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async deleteUser(id: string) {
    return MongoDBService.deleteOne('users', { _id: id });
  }
}
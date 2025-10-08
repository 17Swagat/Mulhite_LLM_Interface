// Define a custom error for better type safety
export class Error_ChatNotFound extends Error {
  constructor(id: string) {
    super(`Chat with ID ${id} does not exist`);
    this.name = 'Error_ChatNotFound';
  }
}
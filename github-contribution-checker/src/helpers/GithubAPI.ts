import axios from 'axios';

export default class GithubAPI {
  private constructor() { }

  public static async getContributionsForUser(username: string): Promise<any> {
    try {
      // get any commits made by a user
      const response = await axios(`https://api.github.com/users/${username}/events`, {
        headers: {
          Authorization: `token ${process.env.GITHUB_API_KEY}`
        }
      });

      const data: Record<string, any>[] = response.data;
      
      return data;
    } catch (error: any) {
      console.error(error);
    }
  }
}

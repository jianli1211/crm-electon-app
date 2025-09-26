import apiClient from "src/utils/request";

class AgentsApi {
  async getAgentsData(data) {
    const response = await apiClient.get(`/agent/agents`, { params: data });
    return response;
  }

  async getAgentSecurityReport(data) {
    const response = await apiClient.get(`/report/security/security`, { params: data });
    return response;
  }
}

export const agentsApi = new AgentsApi();

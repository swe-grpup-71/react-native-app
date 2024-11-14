export const getClusterDatasetFromAPI = async () => {
    const datasetId = "d_dbfabf16158d1b0e1c420627c0819168"
    const url = "https://api-open.data.gov.sg/v1/public/api/datasets/" + datasetId + "/poll-download";
    
    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch poll-download data');
      }
      const jsonData = await response.json();
      if (jsonData['code'] != 0) {
        throw new Error(jsonData['errMsg']);
      }
      
      const fetchUrl = jsonData['data']['url'];
      response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch inner data');
      }
    //   console.log(await response.text())
    console.log("Cluseter dataset retrieved from API");
    return await response.text();
    } catch (e) {
      console.error(e);
    }   
}
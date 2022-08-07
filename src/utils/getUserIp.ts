import type { IpInformation } from 'src/types';

const getUserIp = async () => {
  try {
    const response = await fetch(`https://ipinfo.io/json?token=4e257037e1ae51`);
    const data: IpInformation = await response.json();
    return data.country;
  } catch (error) {
    // throw error if it happens :P
    console.log(error);
    // default to country locale US if there is an error
    return 'US';
  }
};
export default getUserIp;

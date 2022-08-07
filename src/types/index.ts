export interface Countries {
  name: {
    common: string;
    official: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    png: string;
  };
  cca2: string;
}
export interface IpInformation {
  country: string;
}

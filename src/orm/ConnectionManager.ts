import {injectable} from 'inversify';
import {DataSource} from 'typeorm';
import OrmDataSource from '../OrmDataSource';

@injectable()
export class ConnectionManager {
  private static dataSourceInstance: DataSource | undefined;

  public async getConnection(): Promise<DataSource> {
    if (ConnectionManager.dataSourceInstance && ConnectionManager.dataSourceInstance.isInitialized) {
      return ConnectionManager.dataSourceInstance;
    }

    return await this.createConnection();
  }

  protected async createConnection(): Promise<DataSource> {
    const dataSource = OrmDataSource;
    ConnectionManager.dataSourceInstance = await dataSource.initialize();

    return ConnectionManager.dataSourceInstance;
  }

  get entityManager() {
    return ConnectionManager.dataSourceInstance?.manager;
  }
}

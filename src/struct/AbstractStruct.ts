export default abstract class AbstractStruct {
  protected setProperty(key, value): void {
    if (value === undefined) {
      return;
    }
    if ('time' === key) {
      value = new Date(value);
    }

    this[key] = value;
  }

  public fromObject(objData: object): this {
    for (const structKey in objData) {
      this[structKey] = objData[structKey];
    }

    return this;
  }
}

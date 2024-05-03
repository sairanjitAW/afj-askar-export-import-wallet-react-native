/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {AskarModule} from '@credo-ts/askar';
import {
  Agent,
  BasicMessageRecord,
  BasicMessageRepository,
  BasicMessageRole,
  ConsoleLogger,
  InitConfig,
  KeyDerivationMethod,
  LogLevel,
} from '@credo-ts/core';
import {agentDependencies} from '@credo-ts/react-native';
import {ariesAskar} from '@hyperledger/aries-askar-react-native';
import React from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import {pickSingle, types} from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {zip, unzip} from 'react-native-zip-archive';

const getSqliteAgentOptions = (
  name: string,
  extraConfig: Partial<InitConfig> = {},
) => {
  const config: InitConfig = {
    label: `SQLiteAgent: ${name}`,
    walletConfig: {
      id: 'oldWalletId',
      key: 'oldWaletKey',
      keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
    },
    autoUpdateStorageOnStartup: false,
    logger: new ConsoleLogger(LogLevel.trace),
    ...extraConfig,
  };
  return {
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ariesAskar}),
    },
  } as const;
};

const bobAgentOptions = getSqliteAgentOptions('AgentsBob');
const bobAgent = new Agent(bobAgentOptions);

const App = () => {
  const test = async () => {
    const documentDirectory = RNFS.DownloadDirectoryPath;
    const backupDirectory = `${documentDirectory}/Wallet_Backup`;

    const destFileExists = await RNFS.exists(backupDirectory);
    if (destFileExists) {
      await RNFS.unlink(backupDirectory);
    }

    const date = new Date();
    const dformat = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    const WALLET_FILE_NAME = `SSI_Wallet_${dformat}`;

    await RNFS.mkdir(backupDirectory);
    const encryptedFileName = `${WALLET_FILE_NAME}.wallet`;
    const encryptedFileLocation = `${backupDirectory}/${encryptedFileName}`;

    await bobAgent.initialize();
    const bobBasicMessageRepository = bobAgent.dependencyManager.resolve(
      BasicMessageRepository,
    );

    const basicMessageRecord = new BasicMessageRecord({
      id: 'some-id',
      connectionId: 'connId',
      content: 'hello',
      role: BasicMessageRole.Receiver,
      sentTime: 'sentIt',
    });

    // Save in wallet
    await bobBasicMessageRepository.save(bobAgent.context, basicMessageRecord);

    if (!bobAgent.config.walletConfig) {
      throw new Error('No wallet config on bobAgent');
    }

    const backupKey = 'SomeRandomBackUpKey';

    console.log('bobAgent.wallet.isProvisioned', encryptedFileLocation);

    // Create backup and delete wallet
    await bobAgent.wallet.export({path: encryptedFileLocation, key: backupKey});
    await bobAgent.wallet.delete();

    // Import backup with different wallet id and initialize
    await bobAgent.wallet.import(
      {
        id: 'oldWalletId',
        key: 'newWalletKey',
        keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
      },
      {path: encryptedFileLocation, key: backupKey},
    );
    await bobAgent.wallet.initialize({
      id: 'oldWalletId',
      key: 'newWalletKey',
      keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
    });

    const res = await bobBasicMessageRepository.getById(
      bobAgent.context,
      basicMessageRecord.id,
    );

    console.log('check  ', res.id, res.id === basicMessageRecord.id);

    await bobAgent.shutdown();

    if (bobAgent.wallet.isProvisioned) {
      await bobAgent.wallet.delete();
    }
  };

  const exportWallet = async () => {
    try {
      const documentDirectory = RNFS.DownloadDirectoryPath;
      const date = new Date();
      const dformat = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
      const backupDirectory = `${documentDirectory}/Wallet_Backup_${dformat}`;

      const destFileExists = await RNFS.exists(backupDirectory);
      if (destFileExists) {
        await RNFS.unlink(backupDirectory);
      }

      const WALLET_FILE_NAME = 'SSI_Wallet';
      const WALLET_FILE_NAME_DATE = `SSI_Wallet_${dformat}`;

      await RNFS.mkdir(backupDirectory);
      const encryptedFileName = `${WALLET_FILE_NAME}.wallet`;
      const encryptedFileLocation = `${backupDirectory}/${encryptedFileName}`;
      const destinationZipPath = `${documentDirectory}/${WALLET_FILE_NAME_DATE}.zip`;

      await bobAgent.initialize();
      const bobBasicMessageRepository = bobAgent.dependencyManager.resolve(
        BasicMessageRepository,
      );

      const basicMessageRecord = new BasicMessageRecord({
        id: 'some-id',
        connectionId: 'connId',
        content: 'hello',
        role: BasicMessageRole.Receiver,
        sentTime: 'sentIt',
      });

      // Save in wallet
      await bobBasicMessageRepository.save(
        bobAgent.context,
        basicMessageRecord,
      );

      if (!bobAgent.config.walletConfig) {
        throw new Error('No wallet config on bobAgent');
      }

      const backupKey = 'SomeRandomBackUpKey';

      console.log('bobAgent.wallet.isProvisioned', encryptedFileLocation);

      // Create backup and delete wallet
      await bobAgent.wallet.export({
        path: encryptedFileLocation,
        key: backupKey,
      });
      await bobAgent.wallet.delete();

      const res = await zip(backupDirectory, destinationZipPath);
      console.log('res', res);
    } catch (error) {
      console.error('Error in exporting wallet', error);
    }
  };

  const importWallet = async () => {
    try {
      const bobBasicMessageRepository = bobAgent.dependencyManager.resolve(
        BasicMessageRepository,
      );

      const basicMessageRecord = new BasicMessageRecord({
        id: 'some-id',
        connectionId: 'connId',
        content: 'hello',
        role: BasicMessageRole.Receiver,
        sentTime: 'sentIt',
      });

      const pickedFile = await pickSingle({
        type: [types.zip],
        copyTo: 'documentDirectory',
      });

      if (!pickedFile.fileCopyUri) {
        console.log('Error in picking file');
        return;
      }

      const restoreDirectoryPath = RNFS.DocumentDirectoryPath;

      const WALLET_FILE_NAME = 'SSI_Wallet';

      const walletFilePath = `${restoreDirectoryPath}/${WALLET_FILE_NAME}.wallet`;

      const selectedFilePath = await RNFS.stat(pickedFile.fileCopyUri);
      console.log(
        'selectedFilePath',
        selectedFilePath.path,
        restoreDirectoryPath,
      );

      const val = await unzip(selectedFilePath.path, restoreDirectoryPath);
      console.log('val', val);

      const backupKey = 'SomeRandomBackUpKey';

      await bobAgent.wallet.import(
        {
          id: 'oldWalletId',
          key: 'newWalletKey',
          keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
        },
        {path: walletFilePath, key: backupKey},
      );
      await bobAgent.wallet.initialize({
        id: 'oldWalletId',
        key: 'newWalletKey',
        keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
      });

      const res = await bobBasicMessageRepository.getById(
        bobAgent.context,
        basicMessageRecord.id,
      );

      console.log('check  ', res.id, res.id === basicMessageRecord.id);

      await bobAgent.shutdown();

      if (bobAgent.wallet.isProvisioned) {
        await bobAgent.wallet.delete();
      }
    } catch (error) {
      console.log('Error in importing wallet', error);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* <Button title="Test Export Wallet" onPress={test} /> */}
      <View style={{height: 30}} />
      <Button title="Export Wallet" onPress={exportWallet} />
      <View style={{height: 30}} />
      <Button title="Import Wallet" onPress={importWallet} />
    </SafeAreaView>
  );
};

export default App;

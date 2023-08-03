/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {AskarModule} from '@aries-framework/askar';
import {
  Agent,
  BasicMessageRecord,
  BasicMessageRepository,
  BasicMessageRole,
  ConnectionsModule,
  ConsoleLogger,
  InitConfig,
  KeyDerivationMethod,
  LogLevel,
} from '@aries-framework/core';
import {agentDependencies} from '@aries-framework/react-native';
import {ariesAskar} from '@hyperledger/aries-askar-react-native';
import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import RNFS from 'react-native-fs';

const getSqliteAgentOptions = (
  name: string,
  extraConfig: Partial<InitConfig> = {},
) => {
  const config: InitConfig = {
    label: `SQLiteAgent: ${name}`,
    walletConfig: {
      id: `oldWalletId`,
      key: `oldWaletKey`,
      keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
    },
    autoUpdateStorageOnStartup: false,
    logger: new ConsoleLogger(LogLevel.debug),
    ...extraConfig,
  };
  return {
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ariesAskar}),
      connections: new ConnectionsModule({
        autoAcceptConnections: true,
      }),
    },
  } as const;
};

const bobAgentOptions = getSqliteAgentOptions('AgentsBob');
const bobAgent = new Agent(bobAgentOptions);

const App = () => {
  const test = async () => {
    const documentDirectory = RNFS.DocumentDirectoryPath;
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

    // Create backup and delete wallet
    await bobAgent.wallet.export({path: encryptedFileLocation, key: backupKey});
    await bobAgent.wallet.delete();

    // Import backup with different wallet id and initialize
    await bobAgent.wallet.import(
      {
        id: 'newWalletId',
        key: 'newWalletKey',
        keyDerivationMethod: KeyDerivationMethod.Argon2IInt,
      },
      {path: encryptedFileLocation, key: backupKey},
    );
    await bobAgent.wallet.initialize({
      id: 'newWalletId',
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

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Test Export Wallet" onPress={test} />
    </SafeAreaView>
  );
};

export default App;

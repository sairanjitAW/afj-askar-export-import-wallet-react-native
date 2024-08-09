/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {AskarModule} from '@credo-ts/askar';
import {
  Agent,
  ConnectionsModule,
  ConsoleLogger,
  DidExchangeState,
  HttpOutboundTransport,
  Key,
  KeyType,
  LogLevel,
  MediationRecipientModule,
  MediatorPickupStrategy,
  Routing,
  WsOutboundTransport,
} from '@credo-ts/core';
import {agentDependencies} from '@credo-ts/react-native';
import {ariesAskar} from '@hyperledger/aries-askar-react-native';
import React, {useState} from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [agent, setAgent] = useState<
    | undefined
    | Agent<{
        mediationReciepients: MediationRecipientModule;
        connections: ConnectionsModule;
        askar: AskarModule;
      }>
  >();

  const [agent2, setAgent2] = useState<
    | undefined
    | Agent<{
        mediationReciepients: MediationRecipientModule;
        connections: ConnectionsModule;
        askar: AskarModule;
      }>
  >();

  const [invitation, setInvitation] = useState('');

  const initializeAgent = async () => {
    try {
      const mobileVerifier = new Agent({
        config: {
          label: 'Mobile Verifier',
          walletConfig: {
            id: 'walletId',
            key: 'walletKey',
          },
          autoUpdateStorageOnStartup: false,
          logger: new ConsoleLogger(LogLevel.trace),
        },
        dependencies: agentDependencies,
        modules: {
          mediationRecipient: new MediationRecipientModule({
            mediatorInvitationUrl: '',
            mediatorPickupStrategy: MediatorPickupStrategy.PickUpV2,
          }),

          connections: new ConnectionsModule({
            autoAcceptConnections: true,
          }),
          askar: new AskarModule({ariesAskar}),
        },
      });

      mobileVerifier.registerOutboundTransport(new HttpOutboundTransport());
      mobileVerifier.registerOutboundTransport(new WsOutboundTransport());

      // const resp = mobileVerifier.mediationRecipient.findDefaultMediator();

      mobileVerifier
        .initialize()
        .then(() => {
          console.log('Agent initialized!');
          setAgent(mobileVerifier);
        })
        .catch(e => {
          console.error(
            `Something went wrong while setting up the agent! Message: ${e}`,
          );
        });
    } catch (error) {
      console.error('Error initializing agent', error);
    }
  };

  const initializeAgent1 = async () => {
    try {
      const mobileVerifier1 = new Agent({
        config: {
          label: 'Mobile Verifier 1',
          walletConfig: {
            id: 'walletId1',
            key: 'walletKey',
          },
          autoUpdateStorageOnStartup: false,
          logger: new ConsoleLogger(LogLevel.trace),
        },
        dependencies: agentDependencies,
        modules: {
          mediationRecipient: new MediationRecipientModule({
            mediatorInvitationUrl: '',
            mediatorPickupStrategy: MediatorPickupStrategy.PickUpV2,
          }),

          connections: new ConnectionsModule({
            autoAcceptConnections: true,
          }),
          askar: new AskarModule({ariesAskar}),
        },
      });

      mobileVerifier1.registerOutboundTransport(new HttpOutboundTransport());
      mobileVerifier1.registerOutboundTransport(new WsOutboundTransport());

      // const resp = mobileVerifier.mediationRecipient.findDefaultMediator();

      mobileVerifier1
        .initialize()
        .then(() => {
          console.log('Agent initialized! 1');
          setAgent2(mobileVerifier1);
        })
        .catch(e => {
          console.error(
            `Something went wrong while setting up the agent! Message: ${e}`,
          );
        });
    } catch (error) {
      console.error('Error initializing agent', error);
    }
  };

  const createInvitation = async () => {
    if (!agent) {
      return;
    }

    let routingData: Routing | undefined;
    const routing = await AsyncStorage.getItem('routing');

    console.log('routing check', routing);

    if (routing) {
      const parsedRouting = JSON.parse(routing);
      const routingObj = {
        endpoints: parsedRouting.endpoints,
        mediatorId: parsedRouting.mediatorId,
        recipientKey: Key.fromPublicKeyBase58(
          parsedRouting.recipientKey,
          KeyType.Ed25519,
        ),
        routingKeys: parsedRouting.routingKeys.map((key: string) =>
          Key.fromPublicKeyBase58(key, KeyType.Ed25519),
        ),
      };

      routingData = routingObj;
    } else {
      const didRouting = await agent.mediationRecipient.getRouting({});
      const rout = {
        endpoints: didRouting.endpoints,
        mediatorId: didRouting.mediatorId,
        recipientKey: didRouting.recipientKey.publicKeyBase58,
        routingKeys: didRouting.routingKeys.map(key => key.publicKeyBase58),
      };

      routingData = didRouting;
      // setRouting(didRouting);
      console.log('routingData 22', JSON.stringify(routingData));

      await AsyncStorage.setItem('routing', JSON.stringify(rout));
      // setCreatedInvitationDid(did.didState.did);
    }

    // let invitationDid: string | undefined;

    // const inviDid = await AsyncStorage.getItem('invitationDid');

    // if (inviDid) {
    //   invitationDid = inviDid;
    // } else {
    //   const didRouting = await agent.mediationRecipient.getRouting({});

    //   // store routing data in async storage as json

    //   const routingKeys = didRouting.routingKeys.map(
    //     key => key.publicKeyBase58,
    //   );

    //   const rout = {
    //     endpoints: didRouting.endpoints,
    //     mediatorId: didRouting.mediatorId,
    //     recipientKey: didRouting.recipientKey.publicKeyBase58,
    //     routingKeys: didRouting.routingKeys.map(key => key.publicKeyBase58),
    //   };

    //   // const didDocument = createPeerDidDocumentFromServices([
    //   //   {
    //   //     id: 'didcomm',
    //   //     recipientKeys: [didRouting.recipientKey],
    //   //     routingKeys: didRouting.routingKeys || [],
    //   //     serviceEndpoint: didRouting.endpoints[0],
    //   //   },
    //   // ]);
    //   // // Create the DID
    //   // const did = await agent.dids.create<PeerDidNumAlgo2CreateOptions>({
    //   //   didDocument,
    //   //   method: 'peer',
    //   //   options: {
    //   //     numAlgo: PeerDidNumAlgo.MultipleInceptionKeyWithoutDoc,
    //   //   },
    //   // });

    //   console.log('diddoc', JSON.stringify(did));
    //   await AsyncStorage.setItem('invitationDid', did.didState.did);
    //   invitationDid = did.didState.did;
    //   // setCreatedInvitationDid(did.didState.did)
    // }

    // console.log('invitationDid', JSON.stringify(invitationDid));

    const outOfBandRecord = await agent.oob.createInvitation({
      goalCode: 'aries.vc.MobielVerifier.once',
      routing: routingData,
      // invitationDid,
    });

    console.log('outOfBandRecord', outOfBandRecord.outOfBandInvitation);
    console.log(
      'outOfBandRecord',
      outOfBandRecord.outOfBandInvitation.toUrl({
        domain: 'https://github.com',
      }),
    );

    setInvitation(
      outOfBandRecord.outOfBandInvitation.toUrl({
        domain: 'https://github.com',
      }),
    );
  };

  const receiveInvitation = async () => {
    if (!agent2) {
      return;
    }

    const outOfBandRecord = await agent2.oob.receiveInvitationFromUrl(
      invitation,
      {
        reuseConnection: true,
      },
    );

    console.log('outOfBandRecord', outOfBandRecord);
  };

  const getConnections = async () => {
    if (!agent2 && !agent) {
      return;
    }

    const outOfBandRecord = await agent?.connections.findAllByQuery({
      state: DidExchangeState.Completed,
    });
    const outOfBandRecord1 = await agent2?.connections.findAllByQuery({
      state: DidExchangeState.Completed,
    });

    console.log('outOfBandRecord', outOfBandRecord?.length);
    console.log('outOfBandRecord1', outOfBandRecord1?.length);
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{height: 30}} />
      <Button title="Initialize Agent" onPress={initializeAgent} />
      <View style={{height: 30}} />
      <Button title="Initialize Agent 1" onPress={initializeAgent1} />
      <View style={{height: 30}} />
      <Button title="Create Invitation" onPress={createInvitation} />
      <View style={{height: 30}} />
      <Button title="Recieve Invitation" onPress={receiveInvitation} />
      <View style={{height: 30}} />
      <Button title="Get Connections" onPress={getConnections} />
    </SafeAreaView>
  );
};

export default App;

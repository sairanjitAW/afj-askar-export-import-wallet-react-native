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
  HandshakeProtocol,
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
import QRCode from 'react-native-qrcode-svg';
import {testApp} from './src/test';

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

  const [agent3, setAgent3] = useState<
    | undefined
    | Agent<{
        mediationReciepients: MediationRecipientModule;
        connections: ConnectionsModule;
        askar: AskarModule;
      }>
  >();

  const [invitation, setInvitation] = useState('Hello');

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
            mediatorInvitationUrl:
              'http://192.168.1.27:3000/invite?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiJhNzJhMjg4Ni1iMjdmLTRkNGEtYTc1Ni1mOGRiYTc4ODc3NDEiLCJsYWJlbCI6IkNSRURFQkwgTWVkaWF0b3IiLCJhY2NlcHQiOlsiZGlkY29tbS9haXAxIiwiZGlkY29tbS9haXAyO2Vudj1yZmMxOSJdLCJoYW5kc2hha2VfcHJvdG9jb2xzIjpbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4xIiwiaHR0cHM6Ly9kaWRjb21tLm9yZy9jb25uZWN0aW9ucy8xLjAiXSwic2VydmljZXMiOlt7ImlkIjoiI2lubGluZS0wIiwic2VydmljZUVuZHBvaW50IjoiaHR0cDovLzE5Mi4xNjguMS4yNzozMDAwIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtwNG1yVFBGQ3ozaFFMaGRrVG1HNEg4d3Zrc2laaXBTdGZyM2JnZXZ3RHExViJdLCJyb3V0aW5nS2V5cyI6W119LHsiaWQiOiIjaW5saW5lLTEiLCJzZXJ2aWNlRW5kcG9pbnQiOiJ3czovLzE5Mi4xNjguMS4yNzozMDAwIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtwNG1yVFBGQ3ozaFFMaGRrVG1HNEg4d3Zrc2laaXBTdGZyM2JnZXZ3RHExViJdLCJyb3V0aW5nS2V5cyI6W119XX0',
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
            mediatorInvitationUrl:
              'http://192.168.1.27:3000/invite?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiJhNzJhMjg4Ni1iMjdmLTRkNGEtYTc1Ni1mOGRiYTc4ODc3NDEiLCJsYWJlbCI6IkNSRURFQkwgTWVkaWF0b3IiLCJhY2NlcHQiOlsiZGlkY29tbS9haXAxIiwiZGlkY29tbS9haXAyO2Vudj1yZmMxOSJdLCJoYW5kc2hha2VfcHJvdG9jb2xzIjpbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4xIiwiaHR0cHM6Ly9kaWRjb21tLm9yZy9jb25uZWN0aW9ucy8xLjAiXSwic2VydmljZXMiOlt7ImlkIjoiI2lubGluZS0wIiwic2VydmljZUVuZHBvaW50IjoiaHR0cDovLzE5Mi4xNjguMS4yNzozMDAwIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtwNG1yVFBGQ3ozaFFMaGRrVG1HNEg4d3Zrc2laaXBTdGZyM2JnZXZ3RHExViJdLCJyb3V0aW5nS2V5cyI6W119LHsiaWQiOiIjaW5saW5lLTEiLCJzZXJ2aWNlRW5kcG9pbnQiOiJ3czovLzE5Mi4xNjguMS4yNzozMDAwIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtwNG1yVFBGQ3ozaFFMaGRrVG1HNEg4d3Zrc2laaXBTdGZyM2JnZXZ3RHExViJdLCJyb3V0aW5nS2V5cyI6W119XX0',
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

  const initializeAgent2 = async () => {
    try {
      const mobileVerifier2 = new Agent({
        config: {
          label: 'Mobile Verifier 2',
          walletConfig: {
            id: 'walletId2',
            key: 'walletKey',
          },
          autoUpdateStorageOnStartup: false,
          logger: new ConsoleLogger(LogLevel.trace),
        },
        dependencies: agentDependencies,
        modules: {
          mediationRecipient: new MediationRecipientModule({
            mediatorInvitationUrl:
              'http://192.168.1.27:3000/invite?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiJhNzJhMjg4Ni1iMjdmLTRkNGEtYTc1Ni1mOGRiYTc4ODc3NDEiLCJsYWJlbCI6IkNSRURFQkwgTWVkaWF0b3IiLCJhY2NlcHQiOlsiZGlkY29tbS9haXAxIiwiZGlkY29tbS9haXAyO2Vudj1yZmMxOSJdLCJoYW5kc2hha2VfcHJvdG9jb2xzIjpbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4xIiwiaHR0cHM6Ly9kaWRjb21tLm9yZy9jb25uZWN0aW9ucy8xLjAiXSwic2VydmljZXMiOlt7ImlkIjoiI2lubGluZS0wIiwic2VydmljZUVuZHBvaW50IjoiaHR0cDovLzE5Mi4xNjguMS4yNzozMDAwIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtwNG1yVFBGQ3ozaFFMaGRrVG1HNEg4d3Zrc2laaXBTdGZyM2JnZXZ3RHExViJdLCJyb3V0aW5nS2V5cyI6W119LHsiaWQiOiIjaW5saW5lLTEiLCJzZXJ2aWNlRW5kcG9pbnQiOiJ3czovLzE5Mi4xNjguMS4yNzozMDAwIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtwNG1yVFBGQ3ozaFFMaGRrVG1HNEg4d3Zrc2laaXBTdGZyM2JnZXZ3RHExViJdLCJyb3V0aW5nS2V5cyI6W119XX0',
            mediatorPickupStrategy: MediatorPickupStrategy.PickUpV2,
          }),

          connections: new ConnectionsModule({
            autoAcceptConnections: true,
          }),
          askar: new AskarModule({ariesAskar}),
        },
      });

      mobileVerifier2.registerOutboundTransport(new HttpOutboundTransport());
      mobileVerifier2.registerOutboundTransport(new WsOutboundTransport());

      // const resp = mobileVerifier.mediationRecipient.findDefaultMediator();

      mobileVerifier2
        .initialize()
        .then(() => {
          console.log('Agent initialized! 2');
          setAgent3(mobileVerifier2);
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

    // let routingData: Routing | undefined;
    // const routing = await AsyncStorage.getItem('routing');

    // console.log('routing check', routing);

    // if (routing) {
    //   const parsedRouting = JSON.parse(routing);
    //   const routingObj = {
    //     endpoints: parsedRouting.endpoints,
    //     mediatorId: parsedRouting.mediatorId,
    //     recipientKey: Key.fromPublicKeyBase58(
    //       parsedRouting.recipientKey,
    //       KeyType.Ed25519,
    //     ),
    //     routingKeys: parsedRouting.routingKeys.map((key: string) =>
    //       Key.fromPublicKeyBase58(key, KeyType.Ed25519),
    //     ),
    //   };

    //   routingData = routingObj;
    // } else {
    //   const didRouting = await agent.mediationRecipient.getRouting({});
    //   const rout = {
    //     endpoints: didRouting.endpoints,
    //     mediatorId: didRouting.mediatorId,
    //     recipientKey: didRouting.recipientKey.publicKeyBase58,
    //     routingKeys: didRouting.routingKeys.map(key => key.publicKeyBase58),
    //   };

    //   routingData = didRouting;
    //   // setRouting(didRouting);
    //   console.log('routingData 22', JSON.stringify(routingData));

    //   await AsyncStorage.setItem('routing', JSON.stringify(rout));
    //   // setCreatedInvitationDid(did.didState.did);
    // }

    let invitationDid: string | undefined;

    const inviteDid = await AsyncStorage.getItem('invitationDid');

    if (inviteDid) {
      invitationDid = inviteDid;
    }
    // else {
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
      invitationDid,
      // routing: routingData,
      // invitationDid,
    });

    // if (!inviDid) {
    const inviDid = outOfBandRecord.outOfBandInvitation.invitationDids[0];
    await AsyncStorage.setItem('invitationDid', inviDid);
    // }

    console.log(
      'outOfBandRecord',
      outOfBandRecord.outOfBandInvitation.invitationDids,
    );
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

    // const inv =
    //   'https://github.com?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiI3ZGU1NjM3ZS1jNTkwLTQ2ZDktODA4OC0wNTU3YTEwZWZjYTIiLCJsYWJlbCI6Ik1vYmlsZSBWZXJpZmllciIsImdvYWxfY29kZSI6ImFyaWVzLnZjLk1vYmllbFZlcmlmaWVyLm9uY2UiLCJhY2NlcHQiOlsiZGlkY29tbS9haXAxIiwiZGlkY29tbS9haXAyO2Vudj1yZmMxOSJdLCJoYW5kc2hha2VfcHJvdG9jb2xzIjpbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4xIiwiaHR0cHM6Ly9kaWRjb21tLm9yZy9jb25uZWN0aW9ucy8xLjAiXSwic2VydmljZXMiOlsiZGlkOnBlZXI6Mi5WejZNa204QUNhaDFSb3JwemYzQlBZeFJIN0c1WU0zS1VVdTFLSGtaTVRpYmdSeWdoLkV6NkxTakhkRlc3R2lzUVdoMUpNMnJBV2tVRnRlMm9aYVV4ejNxblA1Y2FOZU5VRkIuU2V5SnpJam9pYUhSMGNEb3ZMekU1TWk0eE5qZ3VNUzR5Tnpvek1EQXdJaXdpZENJNkltUnBaQzFqYjIxdGRXNXBZMkYwYVc5dUlpd2ljSEpwYjNKcGRIa2lPakFzSW5KbFkybHdhV1Z1ZEV0bGVYTWlPbHNpSTJ0bGVTMHhJbDBzSW5JaU9sc2laR2xrT210bGVUcDZOazFyZFZCTWNIZzNUVlZ2YTAxS1prSTBhRXAzWVRoU05VUk1jREV4YVZOa2ExRldZMHczUkdGT1puVjBibGNqZWpaTmEzVlFUSEI0TjAxVmIydE5TbVpDTkdoS2QyRTRValZFVEhBeE1XbFRaR3RSVm1OTU4wUmhUbVoxZEc1WElsMTkiXX0';

    const outOfBandRecord = await agent2.oob.receiveInvitationFromUrl(
      invitation,
      {
        reuseConnection: true,
      },
    );

    console.log('outOfBandRecord', outOfBandRecord);
  };

  const receiveInvitation1 = async () => {
    if (!agent3) {
      return;
    }

    // const inv =
    //   'https://github.com?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiI3ZGU1NjM3ZS1jNTkwLTQ2ZDktODA4OC0wNTU3YTEwZWZjYTIiLCJsYWJlbCI6Ik1vYmlsZSBWZXJpZmllciIsImdvYWxfY29kZSI6ImFyaWVzLnZjLk1vYmllbFZlcmlmaWVyLm9uY2UiLCJhY2NlcHQiOlsiZGlkY29tbS9haXAxIiwiZGlkY29tbS9haXAyO2Vudj1yZmMxOSJdLCJoYW5kc2hha2VfcHJvdG9jb2xzIjpbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4xIiwiaHR0cHM6Ly9kaWRjb21tLm9yZy9jb25uZWN0aW9ucy8xLjAiXSwic2VydmljZXMiOlsiZGlkOnBlZXI6Mi5WejZNa204QUNhaDFSb3JwemYzQlBZeFJIN0c1WU0zS1VVdTFLSGtaTVRpYmdSeWdoLkV6NkxTakhkRlc3R2lzUVdoMUpNMnJBV2tVRnRlMm9aYVV4ejNxblA1Y2FOZU5VRkIuU2V5SnpJam9pYUhSMGNEb3ZMekU1TWk0eE5qZ3VNUzR5Tnpvek1EQXdJaXdpZENJNkltUnBaQzFqYjIxdGRXNXBZMkYwYVc5dUlpd2ljSEpwYjNKcGRIa2lPakFzSW5KbFkybHdhV1Z1ZEV0bGVYTWlPbHNpSTJ0bGVTMHhJbDBzSW5JaU9sc2laR2xrT210bGVUcDZOazFyZFZCTWNIZzNUVlZ2YTAxS1prSTBhRXAzWVRoU05VUk1jREV4YVZOa2ExRldZMHczUkdGT1puVjBibGNqZWpaTmEzVlFUSEI0TjAxVmIydE5TbVpDTkdoS2QyRTRValZFVEhBeE1XbFRaR3RSVm1OTU4wUmhUbVoxZEc1WElsMTkiXX0';

    const outOfBandRecord = await agent3.oob.receiveInvitationFromUrl(
      invitation,
      {
        reuseConnection: true,
      },
    );

    console.log('outOfBandRecord', outOfBandRecord);
  };

  const getConnections = async () => {
    if (!agent2 && !agent3 && !agent) {
      return;
    }

    const outOfBandRecord = await agent?.connections.findAllByQuery({
      state: DidExchangeState.Completed,
    });
    const outOfBandRecord1 = await agent2?.connections.findAllByQuery({
      state: DidExchangeState.Completed,
    });

    const outOfBandRecord2 = await agent3?.connections.findAllByQuery({
      state: DidExchangeState.Completed,
    });

    console.log('outOfBandRecord', outOfBandRecord?.length);
    console.log('outOfBandRecord1', outOfBandRecord1?.length);
    console.log('outOfBandRecord2', outOfBandRecord2?.length);
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{height: 30}} />
      {/* <Button title="Initialize Agent" onPress={initializeAgent} />
      <View style={{height: 30}} />
      <Button title="Initialize Agent 1" onPress={initializeAgent1} />
      <View style={{height: 30}} />
      <Button title="Initialize Agent 2" onPress={initializeAgent2} />
      <View style={{height: 30}} />
      <Button title="Create Invitation" onPress={createInvitation} />
      <View style={{height: 30}} />
      <Button title="Recieve Invitation" onPress={receiveInvitation} />
      <View style={{height: 30}} />
      <Button title="Recieve Invitation 1" onPress={receiveInvitation1} />
      <View style={{height: 30}} />
      <Button title="Get Connections" onPress={getConnections} />
      <View style={{height: 30}} /> */}
      <Button title="Test full flow" onPress={testApp} />
      <View style={{height: 30}} />

      {/* <QRCode value={invitation} size={300} /> */}
    </SafeAreaView>
  );
};

export default App;

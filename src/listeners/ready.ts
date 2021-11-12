import type { ListenerOptions, Piece, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, bold } from 'colorette';
import { Listener, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { readFile } from 'node:fs/promises';
import { rootURL } from '#utils/constants';
import { getEnv } from '#utils/env';
import { URL } from 'node:url';

@ApplyOptions<ListenerOptions>({ once: true })
export default class UserEvent extends Listener<typeof Events.ClientReady> {
	public async run() {
		const raw = await readFile(new URL('package.json', rootURL), 'utf8');
		const { version } = JSON.parse(raw);

		const environment = getEnv('NODE_ENV').default('development').asString();

		this.container.logger.info(
			`

___________                   .__          __           __________        __   
\__    ___/___   _____ ______ |  | _____ _/  |_  ____   \______   \ _____/  |_ 
  |    |_/ __ \ /     \\____ \|  | \__  \\   __\/ __ \   |    |  _//  _ \   __\
  |    |\  ___/|  Y Y  \  |_> >  |__/ __ \|  | \  ___/   |    |   (  <_> )  |  
  |____| \___  >__|_|  /   __/|____(____  /__|  \___  >  |______  /\____/|__|  
             \/      \/|__|             \/          \/          \/             

  ${magenta(version)}
  [${green('+')}] Gateway
  ${magenta('<')}${magentaBright('/')}${magenta('>')} ${bold(`${environment.toUpperCase()} MODE`)}
  
  ${this.storeDebugInformation()}
  `
		);
	}

	private storeDebugInformation() {
		const stores = [...this.container.client.stores.values()];
		return stores //
			.reverse()
			.reduce((list, store) => `${this.styleStore(store, false)}\n${list}`, this.styleStore(stores.pop()!, true));
	}

	private styleStore(store: Store<Piece>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${blue(store.size.toString().padEnd(3, ' '))} ${store.name}`);
	}
}

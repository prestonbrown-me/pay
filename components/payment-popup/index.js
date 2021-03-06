import { useState } from 'react';
import Styles from './styles';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import VBox from '../../src/vbox-service';

import MoneyButton from '../moneybutton';
import VBoxView from '../vbox';
import RelayX from '../relayx';
import ProxyPay from '../proxypay';

const wallets = {
	vbox: {
		name: 'VBox',
		Element: VBoxView
	},
	moneybutton: {
		name: 'Money Button',
		Element: MoneyButton
	},
	relayx: {
		name: 'RelayX',
		Element: RelayX
	},
	proxypay: {
		name: 'Scan QR',
		Element: ProxyPay
	}
};

const PaymentPopup = props => {
	const [wallet, setWallet] = useState('moneybutton');
	const [paid, setPaid] = useState(false);

	const handleChange = (evt, value) => {
		setPaid(false);
		setWallet(evt.target.value);
	};
	const Wallet = wallets[wallet].Element;

	/**
	 * Render all selected and available wallets.
	 */
	const renderWallets = walletList => {
		const newList = [];
		for (const walletItem of walletList) {
			if (walletItem === 'vbox' && !VBox) {
				// Only show 'VBox' if it's defined
				continue;
			}
			newList.push(walletItem);
		}
		return newList.map(each => {
			return (
				<MenuItem
					classes={{
						root: 'twetch-pay-menu-item',
						selected: 'twetch-pay-menu-item-selected'
					}}
					value={each}
					key={each}
				>
					{wallets[each].name}
				</MenuItem>
			);
		});
	};

	const handleClose = () => {
		props.parent.emit('close');
	};

	const walletProps = {
		...props,
		outputs: props.outputs || [],
		moneybuttonProps: {
			...props.moneybuttonProps,
			onCryptoOperations: cryptoOperations => {
				props.parent.emit('cryptoOperations', { cryptoOperations });
			}
		},
		onError: error => {
			props.parent.emit('error', { error });
		},
		onPayment: payment => {
			props.parent.emit('payment', { payment });
			setPaid(true);
			setTimeout(() => {
				setPaid(false);
			}, 1000);
		}
	};

	return (
		<div className="twetch-pay-container" onClick={handleClose}>
			<div className="twetch-pay-wrapper">
				<div className="twetch-pay-grow" />
				<div
					className="twetch-pay"
					onClick={evt => {
						evt.preventDefault();
						evt.stopPropagation();
					}}
				>
					<div className="twetch-pay-header">
						<img src="/logo.svg" />
						<div className="twetch-pay-grow" />
						<p className="twetch-pay-close" onClick={handleClose}>
							Close
						</p>
					</div>
					{props.wallets.length > 1 && (
						<div className="twetch-pay-body">
							<FormControl variant="outlined" margin="dense" className="twetch-pay-form-control">
								<Select
									value={wallet}
									onChange={handleChange}
									className="twetch-pay-select"
									MenuProps={{
										MenuListProps: {
											classes: {
												root: 'twetch-pay-menu-list'
											}
										},
										anchorOrigin: {
											vertical: 'bottom',
											horizontal: 'left'
										},
										transformOrigin: {
											vertical: 'top',
											horizontal: 'left'
										}
									}}
									classes={{
										outlined: 'twetch-pay-select-outlined'
									}}
								>
									{renderWallets(
										props.wallets.filter(item => {
											if (wallets[item]) {
												return true;
											}
											return false;
										})
									)}
								</Select>
							</FormControl>
						</div>
					)}
					<div className="twetch-pay-body">
						{!paid && <Wallet {...walletProps} />}
						{paid && (
							<div>
								<img
									style={{ margin: '0 auto', display: 'block', height: '70px', width: '70px' }}
									src="/checkmark.svg"
								/>
								<div style={{ textAlign: 'center', marginTop: '16px' }}>Payment Sent</div>
							</div>
						)}
					</div>
					<div className="twetch-pay-bumper" />
				</div>
				<div className="twetch-pay-grow" />
			</div>
			<Styles />
		</div>
	);
};

export default PaymentPopup;

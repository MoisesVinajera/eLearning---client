import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/index';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import classes from '../../public/css/styles.module.css';
import {
  DollarOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { stripeCurrencyFormatter } from '../../utils/helpers';
import { toast } from 'react-toastify';

const InstructorRevenue = () => {
  // state
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);
  // context
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    const sendBalanceRequest = async () => {
      try {
        const { data } = await axios.get('/api/instructor/balance');
        setBalance(data);
        console.log(balance);
      } catch (err) {
        console.log(err);
      }
    };
    sendBalanceRequest();
  }, []);

  const payoutSettingsHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/instructor/payout-settings`);
      window.location.href = data;
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error('Unable to access payout settings. Try later. ');
    }
  };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2>
              Revenue report <DollarOutlined className="float-end" />
            </h2>
            <small>
              You get paid directly from stripe to your bank account every 48
              hours
            </small>
            <hr />

            <h4>
              Pending balance
              {balance.pending &&
                balance.pending.map((balancePending, index) => (
                  <span key={index} className="float-end">
                    {stripeCurrencyFormatter({
                      lenguageCode: 'en-US',
                      amount: balancePending.amount,
                      currency: balancePending.currency,
                    })}
                  </span>
                ))}
              {/* <pre>{JSON.stringify(balance.pending, null, 4)}</pre> */}
            </h4>
            <small>For last 48 hours</small>
            <hr />
            <h4>
              Payouts{' '}
              {!loading ? (
                <SettingOutlined
                  className={`float-end ${classes.pointer}`}
                  onClick={payoutSettingsHandler}
                />
              ) : (
                <SyncOutlined spin className={`float-end ${classes.pointer}`} />
              )}
            </h4>
            <small>
              Update your stripe account details or view previous payouts
            </small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;

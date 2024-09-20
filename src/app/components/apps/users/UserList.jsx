import { useEffect } from 'react';
import List from '@mui/material/List';
import { useSelector, useDispatch } from 'react-redux';
import {
  SelectContact,
  fetchContacts,
  DeleteContact,
  toggleStarredContact,
} from '@/store/apps/contacts/ContactSlice';

import Scrollbar from '../../custom-scroll/Scrollbar';
import ContactListItem from './UserListItem';



async function UserList ({ showrightSidebar }) {
  
  let data = await fetch('https://crm.resolvenergiasolar.com/api/users',{
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI2ODAxMDE4LCJpYXQiOjE3MjY3MTQ2MTgsImp0aSI6ImM1ZTBmYTI2MmE1NzQwYjRhMzMxMWQyYWZjY2E3NWY0IiwidXNlcl9pZCI6MX0.3E2C9vWZg7pN33jSNsbbhyd3dcAOaEbbJvB_lZ3vcOU'
  }
  })
  let users = await data.json()
  
  console.log(users)

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchContacts());
  // }, [dispatch]);

  // const getVisibleContacts = (contacts, filter, contactSearch) => {
  //   switch (filter) {
  //     case 'show_all':
  //       return contacts.filter(
  //         (c) => !c.deleted && c.firstname.toLocaleLowerCase().includes(contactSearch),
  //       );

  //     case 'frequent_contact':
  //       return contacts.filter(
  //         (c) =>
  //           !c.deleted &&
  //           c.frequentlycontacted &&
  //           c.firstname.toLocaleLowerCase().includes(contactSearch),
  //       );

  //     case 'starred_contact':
  //       return contacts.filter(
  //         (c) => !c.deleted && c.starred && c.firstname.toLocaleLowerCase().includes(contactSearch),
  //       );

  //     case 'engineering_department':
  //       return contacts.filter(
  //         (c) =>
  //           !c.deleted &&
  //           c.department === 'Engineering' &&
  //           c.firstname.toLocaleLowerCase().includes(contactSearch),
  //       );

  //     case 'support_department':
  //       return contacts.filter(
  //         (c) =>
  //           !c.deleted &&
  //           c.department === 'Support' &&
  //           c.firstname.toLocaleLowerCase().includes(contactSearch),
  //       );

  //     case 'sales_department':
  //       return contacts.filter(
  //         (c) =>
  //           !c.deleted &&
  //           c.department === 'Sales' &&
  //           c.firstname.toLocaleLowerCase().includes(contactSearch),
  //       );

  //     default:
  //       throw new Error(`Unknown filter: ${filter}`);
  //   }
  // };
  // const contacts = useSelector((state) =>
  //   getVisibleContacts(
  //     state.contactsReducer.contacts,
  //     state.contactsReducer.currentFilter,
  //     state.contactsReducer.contactSearch,
  //   ),
  // );

  // const active = useSelector((state) => state.contactsReducer.contactContent);



  return (
    <Scrollbar
      sx={{
        height: { lg: 'calc(100vh - 100px)', md: '100vh' },
        maxHeight: '800px',
      }}
    >
      <List>
        {users.results.map((contact) => (
          <ContactListItem
            key={contact.id}
            active={contact.id}
            {...contact}
            onContactClick={() => {
              dispatch(SelectContact(contact.id));
              showrightSidebar();
            }}
            onDeleteClick={() => dispatch(DeleteContact(contact.id))}
            onStarredClick={() => dispatch(toggleStarredContact(contact.id))}
          />
        ))} 
      </List>
    </Scrollbar>
  );
};

export default UserList;

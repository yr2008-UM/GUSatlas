'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  List,
  ListItem,
  Sheet,
  Menu,
  MenuButton,
  MenuItem,
  Dropdown,
} from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react';

interface SubMenuItem {
  label: string;
  link?: string;
}

interface MenuItem {
  label: string;
  link?: string;
  subItems?: SubMenuItem[];
}

const navigation: MenuItem[] = [
  { label: 'Home', link: '/' },
  {
    label: 'Browse',
    subItems: [
      { label: 'GUS550', link: '/' },
      { label: 'GUS707', link: '/browse/gus707' },
      { label: 'GUSref114', link: '/' }
    ]
  },
  {
    label: 'Tool',
    subItems: [
      { label: 'Blast against GUS Sequences', link: '/blast/gus' },
      { label: 'GUS Identification', link: '/' },
      { label: 'Loop Classification', link: '/' }
    ]
  },
  { label: 'Download', link: '/download' },
  { label: 'About', link: '/about' },
  { label: 'Contact Us', link: '/contact' }
];

export default function NavBar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const renderNavItem = (item: MenuItem) => {
    if (item.subItems) {
      const isOpen = openDropdown === item.label;
      return (
        <Dropdown 
          open={isOpen}
          onOpenChange={(_, isOpen) => {
            setOpenDropdown(isOpen ? item.label : null);
          }}
        >
          <MenuButton
            slots={{ root: ListItem }}
            slotProps={{ root: { role: 'none' } }}
            sx={{
              color: 'neutral.900',
              fontWeight: 'normal',
              '&:hover': {
                backgroundColor: 'neutral.100',
              },
            }}
          >
            {item.label}
            <KeyboardArrowDownIcon 
              sx={{ 
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </MenuButton>
          <Menu
            sx={{
              minWidth: 200,
              backgroundColor: 'background.surface',
              '--ListItem-radius': '8px',
              '--ListItemDecorator-size': '32px',
              zIndex: 10000, // 添加这一行，确保二级菜单在最上层
            }}
          >
            {item.subItems.map((subItem) => (
              <MenuItem
                key={subItem.label}
                component={Link}
                href={subItem.link || '/'}
                sx={{
                  color: 'neutral.900',
                  '&:hover': {
                    backgroundColor: 'neutral.100',
                  },
                }}
              >
                {subItem.label}
              </MenuItem>
            ))}
          </Menu>
        </Dropdown>
      );
    }

    return (
      <ListItem 
        role="none"
        sx={{
          '&:hover': {
            backgroundColor: 'neutral.100',
          },
        }}
      >
        <Link
          href={item.link || '#'}
          style={{
            textDecoration: 'none',
            color: 'var(--joy-palette-neutral-900)',
            fontWeight: pathname === item.link ? 'bold' : 'normal',
          }}
        >
          {item.label}
        </Link>
      </ListItem>
    );
  };

  return (
    <Sheet
      variant="solid"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'neutral.200',
        backgroundColor: 'white',
        boxShadow: 'sm',
      }}
    >
      <Box component="nav" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <List
          role="menubar"
          orientation="horizontal"
          sx={{
            display: 'flex',
            gap: 2,
            '--List-radius': '8px',
            '--List-padding': '4px',
          }}
        >
          {navigation.map((item) => (
            <Box key={item.label} sx={{ display: 'inline-block' }}>
              {renderNavItem(item)}
            </Box>
          ))}
        </List>
      </Box>
    </Sheet>
  );
}

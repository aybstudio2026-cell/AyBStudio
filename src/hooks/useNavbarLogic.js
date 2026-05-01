import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

export function useNavbarLogic() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getProfile = async (userId) => {
      const { data } = await supabase.from('profiles')
        .select('avatar_url, username, balance')
        .eq('id', userId)
        .single();
      setProfile(data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) getProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) getProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 1) {
      const { data, error } = await supabase.from('products')
        .select('id, name, price, image_url')
        .ilike('name', `%${value}%`)
        .limit(5);
      if (!error) setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  return {
    user, profile, isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery, searchResults, setSearchResults,
    isMenuOpen, setIsMenuOpen, handleSearch, handleLogout
  };
}
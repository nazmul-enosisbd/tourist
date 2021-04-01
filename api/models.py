from sqlalchemy import Column, Integer, String, Sequence, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Type(Base):
    __tablename__ = 'types'

    id = Column(Integer, primary_key=True)
    name = Column(String(10))

    def __repr__(self):
        return "%s" % self.name


class Place(Base):
    __tablename__ = 'places'

    id = Column(Integer, Sequence('place_id_seq'), primary_key=True)
    name = Column(String(50))
    address = Column(String(100))
    rating = Column(Integer)
    type_id = Column(Integer, ForeignKey('types.id'))
    picture = Column(String())

    def __repr__(self):
        return "<Place(name='%s')>" % self.name
        # return "{\
        #     id: %s\
        #     name: %s\
        #     address: %s\
        #     rating: %s\
        #     type_id: %s\
        #     picture: %s }" % (self.id, self.name, self.address, self.rating, self.type_id, self.picture)
